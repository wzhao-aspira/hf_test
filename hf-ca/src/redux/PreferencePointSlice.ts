import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { isEmpty, values } from "lodash";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import ValueOf from "../types/valueOf";
import { PreferencePoint } from "../types/PreferencePoint";
import {
    getIsEmptyOnlineDataCachedInd,
    getPreferencePointsByProfileId,
    getPreferencePointsLastUpdateDateFromDB,
} from "../services/PreferencePointService";
import { getPreferencePointListFromDB } from "../db";

interface PreferencePointState {
    data: PreferencePoint[];
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    updateTime: null | number;
    isAPISucceed: boolean;
    isShowSkeletonWhenOffline: boolean;
    lastUpdateDate: string;
}

export const getPreferencePoint = createAsyncThunk(
    "preferencePoint/getPreferencePoint",
    async ({ searchParams }: { searchParams: { activeProfileId: string }; isForce?: boolean }, { dispatch }) => {
        const { activeProfileId } = searchParams;
        const results = await handleError<ReturnType<typeof getPreferencePointsByProfileId>>(
            getPreferencePointsByProfileId(activeProfileId),
            {
                networkErrorByDialog: false,
                dispatch,
            }
        );
        console.log(`api preference point list:${JSON.stringify(results)}`);

        // If the API returns an empty license data then we need to set an indicator here
        const isAPISucceed = results.success;
        const isEmptyOnlineDataCached = await getIsEmptyOnlineDataCachedInd(activeProfileId);
        const dbResult = await getPreferencePointListFromDB(activeProfileId);
        const preferencePointData = values(dbResult);

        const lastUpdateDateResponse = await getPreferencePointsLastUpdateDateFromDB(activeProfileId);

        const isShowSkeletonWhenOffline = isEmpty(preferencePointData) && !isAPISucceed && !isEmptyOnlineDataCached;

        console.log(`preference point list isAPISucceed:${isAPISucceed}`);
        console.log(`db preference point list:${JSON.stringify(preferencePointData)}`);

        const payload = {
            success: true,
            data: preferencePointData,
            isAPISucceed,
            isShowSkeletonWhenOffline,
            lastUpdateDate: lastUpdateDateResponse.lastUpdateDate,
        };

        return payload;
    },
    {
        condition: ({ isForce = false }, { getState }) => {
            // @ts-expect-error
            const { preferencePoint } = getState();
            const { requestStatus, updateTime } = preferencePoint as PreferencePointState;
            if (requestStatus == REQUEST_STATUS.pending) {
                return false;
            }
            if (isForce) {
                return true;
            }
            const result = checkNeedAutoRefreshData(updateTime);
            console.log(`preference point auto refresh result:${result}`);
            return result;
        },
    }
);

const initialState: PreferencePointState = {
    data: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    isAPISucceed: true,
    isShowSkeletonWhenOffline: false,
    lastUpdateDate: "",
};

const preferencePointSlice = createSlice({
    name: "preferencePoint",
    initialState,
    reducers: {
        clearUpdateTime(state) {
            state.updateTime = initialState.updateTime;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPreferencePoint.rejected, (state) => {
            state.requestStatus = REQUEST_STATUS.rejected;
        });
        builder.addCase(getPreferencePoint.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.pending;
        });
        builder.addCase(getPreferencePoint.fulfilled, (state, action) => {
            const payload = action?.payload;
            const { success, data, isAPISucceed, isShowSkeletonWhenOffline, lastUpdateDate } = payload;
            console.log(`payload:${JSON.stringify(payload)}`);
            if (success) {
                // Check if is empty data from the API, if not then need to show the skeleton
                if (isAPISucceed) {
                    const dateNow = moment().unix();
                    state.updateTime = dateNow;
                }
                state.isAPISucceed = isAPISucceed;
                state.isShowSkeletonWhenOffline = isShowSkeletonWhenOffline;
                state.requestStatus = REQUEST_STATUS.fulfilled;
                state.data = data;
                state.lastUpdateDate = lastUpdateDate;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const { reducer, actions } = preferencePointSlice;

const preferencePointReducer = reducer;

export { actions };
export default preferencePointReducer;
