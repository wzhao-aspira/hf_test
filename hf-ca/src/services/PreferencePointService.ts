import { values, isEmpty } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEY_CONSTANT } from "../constants/Constants";
import {
    getPreferencePointLastUpdateDate,
    savePreferencePointLastUpdateDate,
    savePreferencePointListToDB,
} from "../db";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { getPreferencePoints } from "../network/api_client/PreferencePointsApi";

// eslint-disable-next-line import/prefer-default-export
export async function getPreferencePointsByProfileId(profileId: string) {
    const response = await getPreferencePoints(profileId);
    const lastUpdateDate = response?.headers?.["last-updated-date"];

    const { result, errors } = response.data;
    const preferencePointList = result;
    const formattedResult = preferencePointList
        .filter((item) => {
            const { huntTypeName, currentPreferencePoints, lastParticipationLicenseYear } = item;
            const filterResult =
                huntTypeName != null && currentPreferencePoints != null && lastParticipationLicenseYear != null;
            return filterResult;
        })
        .map((item) => {
            const { huntTypeName, currentPreferencePoints, lastParticipationLicenseYear } = item;

            return {
                pk: `${profileId}_${huntTypeName}_${currentPreferencePoints}_${lastParticipationLicenseYear}`,
                profileId,
                huntTypeName,
                currentPreferencePoints,
                lastParticipationLicenseYear,
            };
        });

    if (!isEmpty(formattedResult)) {
        await savePreferencePointListToDB(profileId, formattedResult);
        await storeItem(`${KEY_CONSTANT.keyIsEmptyPreferencePointOnlineDataCached}_${profileId}`, false);
    } else {
        await storeItem(`${KEY_CONSTANT.keyIsEmptyPreferencePointOnlineDataCached}_${profileId}`, true);
    }
    await savePreferencePointLastUpdateDate({ profileId, lastUpdateDate });
    return { formattedResult, errors };
}

export async function getIsEmptyOnlineDataCachedInd(profileId: string) {
    const isEmptyOnlineDataCachedInd = await retrieveItem(
        `${KEY_CONSTANT.keyIsEmptyPreferencePointOnlineDataCached}_${profileId}`
    );

    if (isEmptyOnlineDataCachedInd == null) {
        return false;
    }

    return isEmptyOnlineDataCachedInd;
}

export async function clearIsEmptyOnlineDataCachedInd() {
    const keys = await AsyncStorage.getAllKeys();
    keys.filter((key) => key.includes(KEY_CONSTANT.keyIsEmptyPreferencePointOnlineDataCached)).forEach(async (key) => {
        await storeItem(key, false);
    });
}

export async function getPreferencePointsLastUpdateDateFromDB(activeProfileId: string) {
    const dbResult = await getPreferencePointLastUpdateDate(activeProfileId);
    const result = values(dbResult);
    return !isEmpty(result) && Array.isArray(result) ? result[0] : {};
}
