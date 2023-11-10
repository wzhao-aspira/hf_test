import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";
import type { RootState } from "./Store";
import { formateDateForList, formateDateForDashboard } from "../services/LicenseService";
import { LAST_UPDATE_TIME_DISPLAY_FORMAT } from "../constants/Constants";

const selectLicenseState = (state: RootState) => state.license;

export const selectLicenseForList = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data || [];
    let groupedData = licenseData.reduce((accumulator, item) => {
        const groupKey = item.uiTabId;
        if (!accumulator.has(groupKey)) {
            accumulator.set(groupKey, { groupKey, title: item.uiTabName, data: [] });
        }
        const { validFrom, validTo } = formateDateForList(item);
        accumulator.get(groupKey).data.push({ ...item, validFrom, validTo });

        return accumulator;
    }, new Map());

    groupedData = Array.from(groupedData.values());

    return { ...licenseState, data: groupedData };
});

export const selectLastUpdateTimeFromServer = createSelector(selectLicenseForList, (licenseDataForList) => {
    const lastUpdateTimeFromServer = licenseDataForList.lastUpdateTimeFromServer
        ? moment(licenseDataForList.lastUpdateTimeFromServer).format(LAST_UPDATE_TIME_DISPLAY_FORMAT)
        : null;
    return lastUpdateTimeFromServer;
});

export const selectLicenseForDashboard = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data;
    const data = licenseData?.map((item) => {
        const { validFrom, validTo } = formateDateForDashboard(item);
        return { ...item, validFrom, validTo };
    });

    return { ...licenseState, data };
});

export const selectUpdateTime = createSelector(selectLicenseState, (license) => license.updateTime);
