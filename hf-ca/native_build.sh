#! /bin/bash
set -e

cleanFolder() {
    git reset --hard
    git clean -fd
    mkdir -p build/artifacts
}

addBuildNum() {
    echo "addBuildNum"

    # copy app.json from version project for master branch
    versionWorkSpace=${WORKSPACE}/version
    if [ $originBranch = "origin/master" ]; then
        rm -f ./app.json
        cp $versionWorkSpace/app.json ./
    fi

    buildInfo=$(node ./BuildHelper.js)
    echo $buildInfo
    BUILD_NUMBER=$(echo $buildInfo | cut -d "-" -f 3)
    BUILD_FILE_NAME=HF_CA_${CHANNEL}_$BUILD_NUMBER
    echo $BUILD_FILE_NAME

    # push app.json for Release branch
    if [ $originBranch = "origin/Release_"* ]; then
        git commit -am "AWO-000000 update version number and code"
        branch=${GIT_BRANCH/origin\//\HEAD:}
        git push origin $branch
    fi

    # push app.json for master branch
    if [ $originBranch = "origin/master" ]; then
        cp ./app.json $versionWorkSpace
        cd $versionWorkSpace
        git commit -am "update version number and code"
        git push origin HEAD:master
        cd $WORKSPACE/hf-ca
    fi
}

updateIOSNativeInfo() {
    system=$(uname)
    echo $system

    echo "replace version name and build number in info plist"
    versionName=$(echo $buildInfo | cut -d "-" -f 2)
    buildNumber=$(echo $buildInfo | cut -d "-" -f 3)

    infoPlist="${WORKSPACE}/hf-ca/ios/CDFWMobile/Info.plist"

    sed -i ".bak" "s/1.0.0/$versionName/g" $infoPlist
    sed -i ".bak" "s/2.0.0.0/$buildNumber/g" $infoPlist

    cat $infoPlist

    #replace firebase config file
    rm ${WORKSPACE}/hf-ca/ios/GoogleService-Info.plist
    cp ${WORKSPACE}/credentials/${FIREBASE_DIR}/GoogleService-Info.plist ${WORKSPACE}/hf-ca/ios/GoogleService-Info.plist
}

updateAndroidNativeInfo(){
    system=$(uname)
    echo $system

    echo "replace version name and code in gradle"
    versionName=$(echo $buildInfo | cut -d "-" -f 2)
    versionCode=$(echo $buildInfo | cut -d "-" -f 4)

    gradle="${WORKSPACE}/hf-ca/android/app/build.gradle"
    if [ $system == "Linux" ]; then
        sed -i "s/999/$versionCode/g" $gradle
        sed -i "s/9.0.0/$versionName/g" $gradle
    else
        sed -i "" "s/999/$versionCode/g" $gradle
        sed -i "" "s/9.0.0/$versionName/g" $gradle
    fi

    cat $gradle

    #replace firebase config file
    rm ${WORKSPACE}/hf-ca/android/app/google-services.json
    cp ${WORKSPACE}/credentials/${FIREBASE_DIR}/google-services.json ${WORKSPACE}/hf-ca/android/app/google-services.json
}

updateFirebaseDirectory() {
    if [ $CHANNEL == prod ]; then
        FIREBASE_DIR="firebase-prod"
    else
        FIREBASE_DIR="firebase"
    fi
    
    echo "firebase directory"
    echo $FIREBASE_DIR
}

updateReleaseChannel() {
    echo "updateReleaseChannel"
    system=$(uname)
    echo $system
    if [ $system == "Linux" ]; then
        sed -i "s/dev/$CHANNEL/g" ./src/constants/BuildType.js
    else
        sed -i '.bak' "s/dev/$CHANNEL/g" ./src/constants/BuildType.js
    fi
    cat ./src/constants/BuildType.js
}

buildAndroid() {
    echo ready to run android

    if [ $CHANNEL == prod ]; then
        ANDROID_BUILD_TYPE="aab"
    else
        ANDROID_BUILD_TYPE="apk"
    fi
    
    echo "android build type"
    echo $ANDROID_BUILD_TYPE

    appJSON="${WORKSPACE}/hf-ca/app.json"
    cat $appJSON

    updateAndroidNativeInfo

    # install rnn dependency
    cd ${WORKSPACE}/hf-ca/
    yarn
    
    cd  ${WORKSPACE}/hf-ca/android
    if [ $ANDROID_BUILD_TYPE = apk ]; then
        echo "build apk start"
        ./gradlew clean assembleRelease 
        mv ${WORKSPACE}/hf-ca/android/app/build/outputs/apk/release/*.apk $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME.$ANDROID_BUILD_TYPE
    else
        echo "build aab start"
        ./gradlew clean :app:bundleRelease 
        mv ${WORKSPACE}/hf-ca/android/app/build/outputs/bundle/release/*.aab $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME.$ANDROID_BUILD_TYPE
    fi
}

buildIOS() {
    echo "ready to build iOS"

    appJSON="${WORKSPACE}/hf-ca/app.json"
    cat $appJSON

    updateIOSNativeInfo
    
    # install rnn dependency
    cd ${WORKSPACE}/hf-ca/
    yarn

    # -------start xcode build--------
    cd ${WORKSPACE}/hf-ca/ios
    rm -rf build/
    xcodebuild -alltargets clean

    # -------pod install--------
    pod install --repo-update --verbose

    schemeName=CDFWMobile
    xcodebuild -workspace $schemeName.xcworkspace -archivePath  "build/$schemeName.xcarchive" -scheme $schemeName -configuration Release archive -allowProvisioningUpdates

    # -------Adhoc--------
    xcodebuild -exportArchive -archivePath "build/$schemeName.xcarchive" -exportPath "build/artifacts/" -allowProvisioningUpdates -exportOptionsPlist "JenkinsPlist/exportOptionsAdHoc.plist"
    mv build/artifacts/$schemeName.ipa  $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME-adhoc.ipa

    if [ $buildAppStreIPA = true ]; then
        # -------Prod--------
        xcodebuild -exportArchive -archivePath "build/$schemeName.xcarchive" -exportPath "build/artifacts/" -allowProvisioningUpdates -exportOptionsPlist "JenkinsPlist/exportOptions.plist"
        mv build/artifacts/$schemeName.ipa  $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME-appStore.ipa
    fi

}

# qa, uat, prod
CHANNEL=$1
# android, ios
PLATFORM=$2
# branch name
originBranch=$3
echo $originBranch
# should need upload to testflight
buildAppStreIPA=$4
echo $buildAppStreIPA
cd $WORKSPACE/hf-ca
cleanFolder

yarn
addBuildNum
updateReleaseChannel
updateFirebaseDirectory
# disable charles for uat and prod
system=$(uname)
echo $system
if [[ $channel == "uat" || $channel == "prod" ]]; then
	if [ $system == "Linux" ]; then
		sed -i 's/android:networkSecurityConfig="@xml\/network_security_config"//g' ${WORKSPACE}/hf-ca/android/app/src/main/AndroidManifest.xml
	else
		sed -i '' 's/android:networkSecurityConfig="@xml\/network_security_config"//g' ${WORKSPACE}/hf-ca/android/app/src/main/AndroidManifest.xml
	fi
	rm ${WORKSPACE}/hf-ca/android/app/src/main/res/xml/network_security_config.xml

fi
if [ $PLATFORM == ios ]; then
    buildIOS
else
    buildAndroid
fi