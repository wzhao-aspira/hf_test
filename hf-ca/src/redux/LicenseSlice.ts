/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { isEmpty } from "lodash";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
    getIsEmptyOnlineDataCachedInd,
    getLicenseData,
    getLicenseLastUpdateTimeDataFromDB,
    getLicenseListDataFromDB,
} from "../services/LicenseService";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import { showToast } from "../helper/AppHelper";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import ValueOf from "../types/valueOf";
import { License } from "../types/license";

interface LicenseState {
    data: License[];
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    updateTime: null | number;
    isAPISucceed: boolean;
    isShowSkeletonWhenOffline: boolean;
    lastUpdateTimeFromServer: null | string;
}

export const getLicense = createAsyncThunk(
    "license/getLicense",
    async (
        {
            searchParams,
            isForce = false,
            useCache = false,
        }: { searchParams: { activeProfileId: string }; isForce?: boolean; useCache?: boolean },
        { dispatch }
    ) => {
        console.log(`LicenseSlice - getLicense - isForce:${isForce}, useCache:${useCache}`);
        const licenses = { success: false, data: null };
        let isAPISucceed = false;
        if (useCache == false) {
            const results = await handleError<ReturnType<typeof getLicenseData>>(getLicenseData(searchParams), {
                networkErrorByDialog: false,
                dispatch,
            });
            // If the API returns an empty license data then we need to set an indicator here
            isAPISucceed = results.success;
            if (isAPISucceed) {
                licenses.success = isAPISucceed;
                licenses.data = results.data.formattedResult;
            } else {
                const licensesFromDB = await getLicenseListDataFromDB(searchParams);
                licenses.success = true;
                licenses.data = licensesFromDB;
            }
        } else {
            const licensesFromDB = await getLicenseListDataFromDB(searchParams);
            licenses.success = true;
            licenses.data = licensesFromDB;
        }

        const isEmptyOnlineDataCached = await getIsEmptyOnlineDataCachedInd(searchParams);
        const isShowSkeletonWhenOffline = isEmpty(licenses.data) && !isAPISucceed && !isEmptyOnlineDataCached;
        // Last Update Time from Server
        const licenseLastUpdateTime = await handleError(getLicenseLastUpdateTimeDataFromDB(searchParams), {
            showError: false,
            networkErrorByDialog: false,
            dispatch,
        });
        const { lastUpdateTime } = licenseLastUpdateTime.data || {};
        return { ...licenses, isAPISucceed, isShowSkeletonWhenOffline, lastUpdateTime };
    },
    {
        condition: ({ isForce = false }, { getState }) => {
            // @ts-expect-error
            const { license } = getState();
            const { requestStatus, updateTime } = license as LicenseState;
            if (requestStatus == REQUEST_STATUS.pending) {
                return false;
            }
            if (isForce) {
                return true;
            }
            const result = checkNeedAutoRefreshData(updateTime);
            console.log("LicenseSlice - checkNeedAutoRefreshData - result:", result);
            return result;
        },
    }
);

const initialState: LicenseState = {
    data: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    isAPISucceed: true,
    isShowSkeletonWhenOffline: false,
    lastUpdateTimeFromServer: null,
};

const licenseSlice = createSlice({
    name: "license",
    initialState,
    reducers: {
        clearUpdateTime(state) {
            state.updateTime = initialState.updateTime;
        },
        updateLicense(state, action: PayloadAction<License[]>) {
            const { payload } = action;
            state.data = payload;
        },
        updateLastUpdateTime(state, action: PayloadAction<string>) {
            const { payload } = action;
            state.updateTime = moment().unix();
            state.lastUpdateTimeFromServer = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLicense.rejected, (state, action) => {
            const { error } = action;
            showToast(error.message);
            state.requestStatus = REQUEST_STATUS.rejected;
        });
        builder.addCase(getLicense.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.pending;
        });
        builder.addCase(getLicense.fulfilled, (state, action) => {
            const payload = action?.payload;
            const { success, data, isAPISucceed, isShowSkeletonWhenOffline, lastUpdateTime } = payload;
            if (success) {
                // Check if is empty data from the API, if not then need to show the skeleton
                if (isAPISucceed) {
                    const dateNow = moment().unix();
                    state.updateTime = dateNow;
                }
                state.isAPISucceed = isAPISucceed;
                state.isShowSkeletonWhenOffline = isShowSkeletonWhenOffline;
                state.lastUpdateTimeFromServer = lastUpdateTime;
                state.requestStatus = REQUEST_STATUS.fulfilled;
                state.data = data;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const { reducer, actions } = licenseSlice;

const licenseReducer = reducer;

export { actions };
export default licenseReducer;
