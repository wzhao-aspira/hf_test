import { isEmpty } from "lodash";
import licenseData from "./mock_data/license.json";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";

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

export async function getLicenseData(searchParams) {
    const { activeProfileId } = searchParams;
    const mockData = licenseData
        .filter((item) => item.profileId === activeProfileId)
        .map((item) => {
            const name = getName(item);
            return { id: item.id, validFrom: item.validFrom, validTo: item.validTo, name };
        });

    return new Promise((res) => {
        setTimeout(() => res(mockData), 3000);
    });
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
