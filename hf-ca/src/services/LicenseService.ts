import { values, isEmpty } from "lodash";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import licensesAPIs from "../network/api_client/LicensesAPIs";
import {
    getLicenseLastUpdateTimeData,
    getLicenseListData,
    saveLicenseLastUpdateTimeData,
    saveLicenseListData,
} from "../db";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

const formateDate = (item, formatter) => {
    const validFrom =
        item.validFrom && DateUtils.dateToFormat(item.validFrom, formatter, AppContract.inputFormat.fmt_2);
    const validTo = item.validTo && DateUtils.dateToFormat(item.validTo, formatter, AppContract.inputFormat.fmt_2);
    return { validFrom, validTo };
};

export const formateDateForList = (item) => {
    return formateDate(item, AppContract.outputFormat.fmt_1);
};

export const formateDateForDashboard = (item) => {
    return formateDate(item, AppContract.outputFormat.fmt_2);
};

export async function getLicenseData(searchParams: { activeProfileId: string }) {
    const { activeProfileId } = searchParams;

    const getLicensesByCustomerIDRequestResult = await licensesAPIs.getLicensesByCustomerID(activeProfileId);
    // @ts-ignore
    const { lastUpdateTime } = getLicensesByCustomerIDRequestResult;
    const { result, errors } = getLicensesByCustomerIDRequestResult.data;
    const licenseList = result;

    const formattedResult = licenseList.map((item) => {
        const {
            documentCode,
            validityCornerTitle,
            licenseId,
            validFrom,
            validTo,
            listGroupingId,
            listGroupingName,
            itemTypeId,
            itemName,
            itemYear,
            altTextValidFromTo,
            additionalValidityText,
            lePermitTypeName,
            lePermitId,
            printedDescriptiveText,
            isHarvestReportSubmissionAllowed,
            isHarvestReportSubmissionEnabled,
            isHarvestReportSubmitted,
            mobileAppNeedPhysicalDocument,
            licenseReportId,
        } = item;
        const { duplicateWatermark, documentNumber, amount } = {
            ...item.document,
        };
        const name = `${itemYear} - ${itemName}`;

        return {
            pk: `${activeProfileId}_${licenseId}`,
            profileId: activeProfileId,
            id: licenseId,
            name,
            validFrom,
            validTo,
            documentCode,
            validityCornerTitle,
            altTextValidFromTo,
            additionalValidityText,
            itemTypeId,
            itemName,
            lePermitTypeName,
            lePermitId,
            printedDescriptiveText,
            duplicateWatermark,
            amount,
            documentNumber, // for barcode
            uiTabId: listGroupingId,
            uiTabName: listGroupingName,
            mobileAppNeedPhysicalDocument,
            isHarvestReportSubmissionAllowed,
            isHarvestReportSubmissionEnabled,
            isHarvestReportSubmitted,
            licenseReportId,
        };
    });
    // Save the license list data per profile
    if (!isEmpty(formattedResult)) {
        await saveLicenseListData(activeProfileId, formattedResult);
        await storeItem(`${KEY_CONSTANT.keyIsEmptyOnlineDataCached}_${activeProfileId}`, false);
    } else {
        await storeItem(`${KEY_CONSTANT.keyIsEmptyOnlineDataCached}_${activeProfileId}`, true);
    }
    if (lastUpdateTime) {
        await saveLicenseLastUpdateTimeData({ profileId: activeProfileId, lastUpdateTime });
    }
    return { formattedResult, errors };
}

export async function getIsEmptyOnlineDataCachedInd(searchParams: { activeProfileId: string }) {
    const { activeProfileId } = searchParams;
    const isEmptyOnlineDataCachedInd = await retrieveItem(
        `${KEY_CONSTANT.keyIsEmptyOnlineDataCached}_${activeProfileId}`
    );
    if (isEmptyOnlineDataCachedInd == null) return false;
    return isEmptyOnlineDataCachedInd;
}

export async function getLicenseListDataFromDB(searchParams: { activeProfileId: string }) {
    const { activeProfileId } = searchParams;
    const dbResult = await getLicenseListData(activeProfileId);
    return values(dbResult);
}

export async function getLicenseLastUpdateTimeDataFromDB(searchParams: { activeProfileId: string }) {
    const { activeProfileId } = searchParams;
    const dbResult = await getLicenseLastUpdateTimeData(activeProfileId);
    const result = values(dbResult);
    return result ? result[0] : {};
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
