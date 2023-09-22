/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { getAccessPermitData } from "../services/AccessPermitServices";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import ValueOf from "../types/valueOf";
import { AccessPermit } from "../types/accessPermit";
import { saveAccessPermitDataToDB, getAccessPermitDataFromDB } from "../db";

interface AccessPermitState {
    data: AccessPermit;
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    offline: boolean;
}

const initialState: AccessPermitState = { data: null, requestStatus: REQUEST_STATUS.idle, offline: false };

export const getAccessPermit = createAsyncThunk(
    "accessPermit/getAccessPermit",
    async ({ searchParams }: { searchParams: { activeProfileId: string } }, { dispatch }) => {
        let result;
        const dataFromAPI = await handleError(getAccessPermitData(searchParams), {
            dispatch,
            networkErrorByDialog: false,
        });
        const { activeProfileId } = searchParams;
        if (dataFromAPI.success) {
            result = { ...dataFromAPI, offline: false };
            const dataForOffline = { ...dataFromAPI.data, profileId: activeProfileId };
            await saveAccessPermitDataToDB(dataForOffline);
            console.log("get access permit data from api");
        } else {
            const data = await getAccessPermitDataFromDB(activeProfileId);
            result = { success: true, data, offline: true };
            console.log("get access permit data from db");
        }

        return result;
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
            state.offline = result.offline;
        });
    },
});

const accessPermitReducer = accessPermitSlice.reducer;

export default accessPermitReducer;
