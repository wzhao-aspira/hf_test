import { values } from "lodash";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import licensesAPIs from "../network/api_client/LicensesAPIs";
import licenseDetailMockData from "./mock_data/licenseDetail.json";
import { getLicenseList, saveLicenseList } from "../db";

// API not ready, use mock data
const NeedPhysicalDocumentItemIds = [16, 18, 19];

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

    const { result, errors } = getLicensesByCustomerIDRequestResult.data;
    const licenseList = result;

    const formattedResult = licenseList.map((item) => {
        const { licenseId, validFrom, validTo, uiTabId, uiTabName, itemTypeId, itemName, itemYear } = item;
        const { licenseOwner, GOID, stateID, documentNumber } = {
            ...licenseDetailMockData.document,
            ...item.document,
        };
        const name = `${itemYear} - ${itemName}`;
        const mobileAppNeedPhysicalDocument = NeedPhysicalDocumentItemIds.includes(itemTypeId);

        return {
            pk: `${activeProfileId}_${licenseId}`,
            profileId: activeProfileId,
            id: licenseId,
            name,
            validFrom,
            validTo,
            licenseOwner,
            GOID,
            stateID,
            documentNumber, // for barcode
            basicInformation: licenseDetailMockData.basicInformation,
            notification: licenseDetailMockData.notification,
            uiTabId,
            uiTabName,
            mobileAppNeedPhysicalDocument,
        };
    });
    // Save the license list data per profile
    await saveLicenseList(formattedResult);
    return { formattedResult, errors };
}

export async function getLicenseListDataFromDB(searchParams: { activeProfileId: string }) {
    const { activeProfileId } = searchParams;
    const dbResult = await getLicenseList(activeProfileId);
    return values(dbResult);
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
