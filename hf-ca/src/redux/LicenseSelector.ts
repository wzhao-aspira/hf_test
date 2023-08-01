import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { formateDateForList, formateDateForDashboard } from "../services/LicenseService";

const MAX_CAROUSEL_COUNT = 4;

const selectLicenseState = (state: RootState) => state.license;

export const selectLicenseForList = createSelector(selectLicenseState, (licenseState) => {
    const data = licenseState.data?.map((item) => {
        const { validFrom, validTo } = formateDateForList(item);
        return { ...item, validFrom, validTo };
    });

    return { ...licenseState, data };
});

export const selectLicenseForDashboard = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data;
    const license = licenseData?.length > MAX_CAROUSEL_COUNT ? licenseData.slice(0, MAX_CAROUSEL_COUNT) : licenseData;

    const data = license?.map((item) => {
        const { validFrom, validTo } = formateDateForDashboard(item);
        return { ...item, validFrom, validTo };
    });

    return { ...licenseState, data };
});
