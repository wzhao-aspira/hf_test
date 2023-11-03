import { isEmpty } from "lodash";

import MiscellaneousApi from "../network/api_client/Miscellaneous";
import { retrieveItem, storeItem } from "../helper/StorageHelper";

import { handleError } from "../network/APIUtil";
import { KEY_CONSTANT } from "../constants/Constants";
import DialogHelper from "../helper/DialogHelper";
import VersionUpgrade, { UpgradeDialog } from "../components/VersionUpgrade";
import NavigationService from "../navigation/NavigationService";

let displayCount = 0;

export async function checkVersion() {
    if (__DEV__) {
        return;
    }

    const response = await handleError(MiscellaneousApi.checkNewVersionAPI(), {
        showError: false,
        showLoading: false,
    });
    const { success, error } = response;
    if (!success) {
        console.log(error);

        return;
    }
    const { data } = response.data;
    const { isValidResponse, result: versionResult } = data;
    if (!isValidResponse) {
        return;
    }
    // console.log(versionResult);
    onGetVersionInfo(versionResult);
}

async function onGetVersionInfo(versionResult) {
    if (UpgradeDialog.show) {
        NavigationService.back();
    }

    storeItem(KEY_CONSTANT.keyVersionInfo, versionResult);
    let oldVersion;
    try {
        const countString = await retrieveItem(KEY_CONSTANT.keyUpdatePromoteCount);
        if (!isEmpty(countString)) {
            displayCount = parseInt(countString);
        }
        oldVersion = await retrieveItem(KEY_CONSTANT.keyVersionInfo);
        // console.log(`old version:${JSON.stringify(oldVersion)}`);
        console.log(`display count:${displayCount}`);
    } catch (error) {
        // do nothing
    }
    const result = {
        optionalUpdate: false,
        forceUpdate: false,
        message: "",
        url: "",
    };
    if (oldVersion) {
        result.forceUpdate = oldVersion.updateOption == "2";
        result.optionalUpdate = displayCount < 1 && oldVersion.updateOption == "1";
        result.message = oldVersion.updateMessage;
        result.url = oldVersion.installerUrl;
    }
    const { updateOption, updateMessage, installerUrl } = versionResult;
    result.message = updateMessage;
    result.url = installerUrl;
    if (updateOption == 0) {
        // no action need
        displayCount = 0;
        storeItem(KEY_CONSTANT.keyUpdatePromoteCount, displayCount.toString());
    } else if (updateOption == 1) {
        // optional update
        result.forceUpdate = false;
        if (!isSameVersion(oldVersion, versionResult)) {
            console.log("not SameVersion");
            result.optionalUpdate = true;
            displayCount = 0;
            storeItem(KEY_CONSTANT.keyUpdatePromoteCount, displayCount.toString());
        } else if (displayCount < 1) {
            result.optionalUpdate = true;
        }
    } else if (updateOption == 2) {
        // force update
        result.optionalUpdate = false;
        result.forceUpdate = true;
        displayCount = 0;
        storeItem(KEY_CONSTANT.keyUpdatePromoteCount, displayCount.toString());
    }

    console.log(result);
    if (!result.optionalUpdate && !result.forceUpdate) {
        return;
    }
    DialogHelper.showCustomDialog({
        renderDialogContent: () => <VersionUpgrade {...result} onCancel={() => onCancelUpdate()} />,
    });
    UpgradeDialog.show = true;
}

export function onCancelUpdate() {
    displayCount += 1;
    console.log(`onCancelUpdate:${displayCount}`);

    storeItem(KEY_CONSTANT.keyUpdatePromoteCount, displayCount.toString());
}

function isSameVersion(version1, version2) {
    if (!version1 || !version2) {
        return false;
    }

    return version1?.latestVersion === version2?.latestVersion && version1?.updateOption === version2?.updateOption;
}
