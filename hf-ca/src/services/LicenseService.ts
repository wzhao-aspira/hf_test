import { isEmpty } from "lodash";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";

import licensesAPIs from "../network/api_client/LicensesAPIs";

const getName = (item) => {
    const { legalName, productName = "" } = item;
    const name = legalName === "-" || isEmpty(legalName) ? productName : legalName;
    return name;
};

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

// Get license data function
export async function getLicenseData(searchParams: { activeProfileId: number }) {
    const { activeProfileId } = searchParams;

    const getLicensesByCustomerIDRequestResult = await licensesAPIs.getLicensesByCustomerID(activeProfileId);

    console.log(JSON.stringify(getLicensesByCustomerIDRequestResult));

    const { result, errors } = getLicensesByCustomerIDRequestResult.data;
    const licenseList = result.items;

    const formattedResult = licenseList.map((item) => {
        return {
            id: item.licenseId,
            validFrom: item.validFrom,
            validTo: item.validTo,
            name: item.documentTitle,
        };
    });

    return { formattedResult, errors };
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
