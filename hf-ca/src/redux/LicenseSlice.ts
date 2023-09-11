/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { getLicenseData, getLicenseListDataFromDB } from "../services/LicenseService";
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
}

export const getLicense = createAsyncThunk(
    "license/getLicense",
    async ({ searchParams }: { searchParams: { activeProfileId: string }; isForce?: boolean }, { dispatch }) => {
        const results = await handleError<ReturnType<typeof getLicenseData>>(getLicenseData(searchParams), {
            networkErrorByDialog: false,
            dispatch,
        });
        // If the API returns an empty license data then we need to set an indicator here
        const isAPISucceed = results.success;
        const licenseData = await handleError(getLicenseListDataFromDB(searchParams), {
            showError: false,
            networkErrorByDialog: false,
            dispatch,
        });
        return { ...licenseData, isAPISucceed };
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
            console.log(`result:${result}`);
            return result;
        },
    }
);

const initialState: LicenseState = {
    data: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    isAPISucceed: true,
};

const licenseSlice = createSlice({
    name: "license",
    initialState,
    reducers: {
        clearUpdateTime(state) {
            state.updateTime = initialState.updateTime;
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
            const { success, data, isAPISucceed } = payload;
            if (success) {
                // Check if is empty data from the API, if not then need to show the skeleton
                if (isAPISucceed) {
                    const dateNow = moment().unix();
                    state.updateTime = dateNow;
                }
                state.isAPISucceed = isAPISucceed;
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
