/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { getLicenseData } from "../services/LicenseService";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import { showToast } from "../helper/AppHelper";
import { REQUEST_STATUS } from "../constants/Constants";

export const getLicense = createAsyncThunk(
    "license/getLicense",
    async ({ searchParams }, { rejectWithValue }) => {
        const result = { success: false };
        try {
            const data = await getLicenseData(searchParams);
            result.success = true;
            result.data = data;
            return result;
        } catch (error) {
            console.log("getLicense --- get error", error);
            return rejectWithValue(error);
        }
    },
    {
        condition: ({ isForce = false }, { getState }) => {
            const { license } = getState();
            const { requestStatus, updateTime } = license;
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

const initialState = { data: null, requestStatus: REQUEST_STATUS.idle, updateTime: null };

const licenseSlice = createSlice({
    name: "license",
    initialState,
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
            const result = action?.payload;
            if (result.success) {
                const dateNow = moment().unix();
                state.requestStatus = REQUEST_STATUS.fulfilled;
                state.updateTime = dateNow;
                state.data = action?.payload?.data;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const licenseReducer = licenseSlice.reducer;

export default licenseReducer;
