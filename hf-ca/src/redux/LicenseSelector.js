import { formateDateForList, formateDateForDashboard } from "../services/LicenseService";

const MAX_CAROUSEL_COUNT = 4;

export const selectLicenseForList = (state) => {
    const data = state.license.data?.map((item) => {
        const { validFrom, validTo } = formateDateForList(item);
        return { ...item, validFrom, validTo };
    });

    return { ...state.license, data };
};

export const selectLicenseForDashboard = (state) => {
    const licenseData = state.license.data;
    const license = licenseData?.length > MAX_CAROUSEL_COUNT ? licenseData.slice(0, MAX_CAROUSEL_COUNT) : licenseData;

    const data = license?.map((item) => {
        const { validFrom, validTo } = formateDateForDashboard(item);
        return { ...item, validFrom, validTo };
    });

    return { ...state.license, data };
};
