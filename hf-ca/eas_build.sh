#! /bin/bash

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

loginExpo() {
    echo "loginExpo"
    expo logout
    if [ $CHANNEL == prod ]; then
        EXPO_USERNAME="aspiramobile"
        EXPO_PASSWORD="aspiramobile2018"
        EAS_PROFILE="production"
        ANDROID_BUILD_TYPE="aab"
        system=$(uname)
        EAS_PROJECT_ID=30c9d2db-3fb7-495a-9a52-e2b362398193
        EAS_PROJECT_ID_PROD=faa36350-e093-43e9-a034-9a5e83e238c3
        if [ $system == "Linux" ]; then
            sed -i "s/$EAS_PROJECT_ID/$EAS_PROJECT_ID_PROD/g" ./app.json
        else
            sed -i '.bak' "s/$EAS_PROJECT_ID/$EAS_PROJECT_ID_PROD/g" ./app.json
        fi
    else
        EXPO_USERNAME="aspiramobiledev"
        EXPO_PASSWORD="awodev!123"
        EAS_PROFILE="preview"
        ANDROID_BUILD_TYPE="apk"
    fi
    expo signin -u $EXPO_USERNAME -p $EXPO_PASSWORD
    expo whoami
}

buildAndroid() {
    echo "buidlAndroid"
    eas build --platform android --local --profile $EAS_PROFILE --non-interactive --clear-cache --output $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME.$ANDROID_BUILD_TYPE
}

buildIOS() {
    echo "buildIOS"
    provision="${WORKSPACE}/credentials/ios/Dist.mobileprovision"
    provisionAdhoc="${WORKSPACE}/credentials/ios/ADHoc.mobileprovision"
    echo $provisionAdhoc
    echo $provision

    # -------Adhoc--------
    echo ready to run eas adhoc build
    # -------replace provisioning file--------
    rm ${WORKSPACE}/credentials/ios/Hunt_Fish.mobileprovision
    cp $provisionAdhoc ${WORKSPACE}/credentials/ios/Hunt_Fish.mobileprovision
    eas build --platform ios --local --profile preview --non-interactive --clear-cache --output $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME-adhoc.ipa

    if [ $buildAppStreIPA == true ]; then
	    # -------Distribution--------
	    echo ready to run eas distribution build
        # -------replace provisioning file--------
        rm ${WORKSPACE}/credentials/ios/Hunt_Fish.mobileprovision
        cp $provision ${WORKSPACE}/credentials/ios/Hunt_Fish.mobileprovision
        eas build --platform ios --local --profile production --non-interactive --clear-cache --output $WORKSPACE/hf-ca/build/artifacts/$BUILD_FILE_NAME-appStore.ipa
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
loginExpo
if [ $PLATFORM == ios ]; then
    buildIOS
else
    buildAndroid
fi
expo logout