/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { DrawResultsListItem, NonPendingStatusList } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import { getDrawApplicationList } from "../services/DrawApplicationServices";
import { getDrawApplicationDataFromDB, saveDrawApplicationDataToDB } from "../db";

interface InitialState {
    instructions: string;
    successfulData: NonPendingStatusList;
    unsuccessfulData: NonPendingStatusList;
    pendingList: DrawResultsListItem[];
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    isUseCacheData: boolean;
    noCacheData: boolean;
}

const initialState: InitialState = {
    instructions: "",
    successfulData: {},
    unsuccessfulData: {},
    pendingList: [],
    requestStatus: REQUEST_STATUS.idle,
    isUseCacheData: false,
    noCacheData: false,
};

export const getDrawList = createAsyncThunk(
    "drawApplication/getDrawList",
    async (activeProfileId: string, { dispatch }) => {
        let result;
        const dataFromAPI = await handleError(getDrawApplicationList(activeProfileId), {
            dispatch,
            networkErrorByDialog: false,
        });
        if (dataFromAPI.success) {
            result = { ...dataFromAPI, isUseCacheData: false };
            console.log("get draw application data from api");

            const dataForOffline = { ...dataFromAPI.data, profileId: activeProfileId };
            await saveDrawApplicationDataToDB(dataForOffline);
        } else {
            const data = await getDrawApplicationDataFromDB(activeProfileId);
            result = { success: true, data, isUseCacheData: true };
            console.log("get draw application data from db");
        }

        return result;
    }
);

const drawApplicationSlice = createSlice({
    name: "drawApplication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDrawList.rejected, (state) => {
            state.requestStatus = REQUEST_STATUS.rejected;
        });
        builder.addCase(getDrawList.pending, (state) => {
            state.requestStatus = REQUEST_STATUS.pending;
        });
        builder.addCase(getDrawList.fulfilled, (state, action) => {
            const result = action?.payload;
            if (result.success) {
                state.requestStatus = REQUEST_STATUS.fulfilled;
                if (!isEmpty(result.data)) {
                    const { successList, unSuccessList, pendingList, instructions } = action.payload.data;
                    state.successfulData = successList;
                    state.unsuccessfulData = unSuccessList;
                    state.pendingList = pendingList;
                    state.instructions = instructions;
                    state.noCacheData = false;
                } else {
                    state.noCacheData = true;
                }
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }

            state.isUseCacheData = result.isUseCacheData;
        });
    },
});

const { actions, reducer } = drawApplicationSlice;

export { actions };
export default reducer;
