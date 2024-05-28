import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleError } from "../network/APIUtil";
import { isEmpty } from "lodash";
import {
    getMobileAppAlertData,
    getMobileAppAlertDataFromDB,
    getMobileAppAlertLastUpdateTimeDataFromCache,
    isMobileAppAlertEmptyResultCached,
    markMobileAppAlertAsRead as markMobileAppAlertAsReadOnServer,
    markMobileAppAlertAsReadInDB,
    syncMobileAppAlertReadStatusIfNecessary,
} from "../services/MobileAppAlertService";
import { MobileAppAlert } from "../types/mobileAppAlert";
import { REQUEST_STATUS } from "../constants/Constants";
import ValueOf from "../types/valueOf";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import moment from "moment";
import { showToast } from "../helper/AppHelper";
import { MarkMobileAppIdAsReadVM } from "../network/generated";
import { markMobileAppAlertNeedSynchronize } from "../db/MobileAppAlert";

interface MobileAppAlertState {
    data: MobileAppAlert[];
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    updateTime?: null | number;
    isAPISucceed: boolean;
    isShowSkeletonWhenOffline: boolean;
    lastUpdateTimeFromServer?: null | string;
}

export const getMobileAppAlert = createAsyncThunk(
    "mobileAppAlert/getMobileAppAlert",
    async (
        {
            isForce = false,
            useCache = false,
            showError = true,
        }: {
            isForce?: boolean;
            useCache?: boolean;
            showError?: boolean;
        },
        { dispatch }
    ) => {
        console.log(`MobileAppAlertSlice - getMobileAppAlert - isForce:${isForce}, useCache:${useCache}`);
        const mobileAppAlerts = { success: false, data: null as MobileAppAlert[] };
        let isAPISucceed = false;
        if (!useCache) {
            await dispatch(syncMobileAppAlertReadStatusToServerIfNecessary());
            const results = await handleError(getMobileAppAlertData(), {
                networkErrorByDialog: false,
                dispatch,
                showError,
            });
            isAPISucceed = results.success;
            if (isAPISucceed) {
                mobileAppAlerts.success = isAPISucceed;
                mobileAppAlerts.data = results.data.formattedResult;
            }
        } else {
            const mobileAppAlertFromDB = await getMobileAppAlertDataFromDB();
            mobileAppAlerts.success = true;
            mobileAppAlerts.data = mobileAppAlertFromDB;
        }

        const isEmptyDataCached = await isMobileAppAlertEmptyResultCached();
        const isShowSkeletonWhenOffline = isEmpty(mobileAppAlerts.data) && !isAPISucceed && !isEmptyDataCached;

        const lastUpdateTime = await getMobileAppAlertLastUpdateTimeDataFromCache();
        return { ...mobileAppAlerts, isAPISucceed, isShowSkeletonWhenOffline, lastUpdateTime };
    },
    {
        condition: ({ isForce = false }, { getState }) => {
            // @ts-expect-error
            const { mobileAppAlert } = getState();
            const { requestStatus, updateTime } = mobileAppAlert as MobileAppAlertState;
            if (requestStatus == REQUEST_STATUS.pending) {
                return false;
            }
            if (isForce) {
                return true;
            }

            const result = checkNeedAutoRefreshData(updateTime);
            console.log("MobileAppAlertSlice - checkNeedAutoRefreshData - result:", result);
            return result;
        },
    }
);

export const markMobileAppAlertsAsRead = createAsyncThunk(
    "mobileAppAlert/markMobileAppAlertsAsRead",
    async (markAsReadVms: Array<MarkMobileAppIdAsReadVM>, { dispatch }) => {
        markMobileAppAlertAsReadInDB(markAsReadVms);
        await dispatch(getMobileAppAlert({ isForce: true, useCache: true }));

        const result = await handleError(markMobileAppAlertAsReadOnServer(markAsReadVms), {
            networkErrorByDialog: false,
            dispatch,
            showError: false,
        });
        if (!result.success) {
            markMobileAppAlertNeedSynchronize(markAsReadVms);
        }
    }
);

export const syncMobileAppAlertReadStatusToServerIfNecessary = createAsyncThunk(
    "mobileAppAlert/syncMobileAppAlertReadStatusToServerIfNecessary",
    async () => {
        const synchronizationStatus = await syncMobileAppAlertReadStatusIfNecessary();
        return synchronizationStatus;
    }
);

const initialState: MobileAppAlertState = {
    data: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    isAPISucceed: true,
    isShowSkeletonWhenOffline: false,
    lastUpdateTimeFromServer: null,
};

const mobileAppAlertSlice = createSlice({
    name: "mobilAppAlert",
    initialState,
    reducers: {
        clearUpdateTime(state) {
            state.updateTime = initialState.updateTime;
        },
        updateMobileAppAlert(state, action: PayloadAction<MobileAppAlert[]>) {
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
        builder.addCase(getMobileAppAlert.rejected, (state, action) => {
            const { error } = action;
            showToast(error.message);
            state.requestStatus = REQUEST_STATUS.rejected;
        });
        builder.addCase(getMobileAppAlert.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.pending;
        });
        builder.addCase(getMobileAppAlert.fulfilled, (state, action) => {
            const payload = action?.payload;
            const { data, isAPISucceed, isShowSkeletonWhenOffline, lastUpdateTime, success } = payload;
            if (success) {
                if (isAPISucceed) {
                    const dateNow = moment().unix();
                    state.updateTime = dateNow;
                }

                state.isAPISucceed = isAPISucceed;
                state.data = data;
                state.isShowSkeletonWhenOffline = isShowSkeletonWhenOffline;
                state.lastUpdateTimeFromServer = lastUpdateTime;
                state.requestStatus = REQUEST_STATUS.fulfilled;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const { reducer, actions } = mobileAppAlertSlice;
const mobileAppAlertReducer = reducer;
export { actions, mobileAppAlertReducer };
