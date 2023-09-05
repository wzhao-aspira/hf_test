import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { formateDateForList, formateDateForDashboard } from "../services/LicenseService";
import { License } from "../types/license";

const MAX_CAROUSEL_COUNT = 4;

const selectLicenseState = (state: RootState) => state.license;

export const selectLicenseForList = createSelector(selectLicenseState, (licenseState) => {
    let groupedData = licenseState.data?.reduce((accumulator, item) => {
        const type = item.uiTabId;
        const { validFrom, validTo } = formateDateForList(item);
        return new Map([...accumulator, [type, [...(accumulator.get(type) || []), { ...item, validFrom, validTo }]]]);
    }, new Map());

    groupedData = Array.from(groupedData, ([, value]: [number, License[]]) => ({
        title: value[0].uiTabName,
        data: value,
    }));

    return { ...licenseState, data: groupedData };
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
