/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { getLicenseData } from "../services/LicenseService";
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
}

export const getLicense = createAsyncThunk(
    "license/getLicense",
    async ({ searchParams }: { searchParams: { activeProfileId: number }; isForce?: boolean }, { dispatch }) => {
        const data = await handleError(getLicenseData(searchParams), {
            dispatch,
        });
        return data;
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

const initialState: LicenseState = { data: null, requestStatus: REQUEST_STATUS.idle, updateTime: null };

const licenseSlice = createSlice({
    name: "license",
    initialState,
    reducers: {},
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
            const { success, data } = payload;

            if (success) {
                const dateNow = moment().unix();
                state.requestStatus = REQUEST_STATUS.fulfilled;
                state.updateTime = dateNow;

                const { formattedResult } = data;
                state.data = formattedResult;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const licenseReducer = licenseSlice.reducer;

export default licenseReducer;
