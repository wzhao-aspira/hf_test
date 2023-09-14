#! /bin/bash
set -e

cleanFolder() {
    git reset --hard
    git clean -fd
    mkdir -p build/artifacts
}

addBuildNum() {
    echo "addBuildNum"
    buildInfo=$(node ./BuildHelper.js)
    echo $buildInfo
    BUILD_NUMBER=$(echo $buildInfo | cut -d "-" -f 3)
    BUILD_FILE_NAME=HF_CA_${CHANNEL}_$BUILD_NUMBER
    echo $BUILD_FILE_NAME
    git commit -am "AWO-000000 update version number and code"
    branch=${GIT_BRANCH/origin\//\HEAD:}
    git push origin $branch
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
    pod install --verbose

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
# should need upload to testflight
buildAppStreIPA=$3
cd $WORKSPACE/hf-ca
cleanFolder
yarn
addBuildNum
updateReleaseChannel
if [ $PLATFORM == ios ]; then
    buildIOS
else
    buildAndroid
fi