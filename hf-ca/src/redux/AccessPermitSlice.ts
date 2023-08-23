/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccessPermitData } from "../services/AccessPermitServices";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import ValueOf from "../types/valueOf";
import { AccessPermit } from "../types/accessPermit";

interface AccessPermitState {
    data: AccessPermit;
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
}

const initialState: AccessPermitState = { data: null, requestStatus: REQUEST_STATUS.idle };

export const getAccessPermit = createAsyncThunk(
    "accessPermit/getAccessPermit",
    async ({ searchParams }: { searchParams: { activeProfileId: string } }, { dispatch }) => {
        const data = await handleError(getAccessPermitData(searchParams), { dispatch });
        return data;
    }
);

const accessPermitSlice = createSlice({
    name: "accessPermit",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAccessPermit.rejected, (state) => {
            state.requestStatus = REQUEST_STATUS.rejected;
        });
        builder.addCase(getAccessPermit.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.pending;
        });
        builder.addCase(getAccessPermit.fulfilled, (state, action) => {
            const result = action?.payload;
            if (result.success) {
                state.requestStatus = REQUEST_STATUS.fulfilled;
                state.data = action?.payload?.data;
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const accessPermitReducer = accessPermitSlice.reducer;

export default accessPermitReducer;
