/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { DrawResultsListItem, NonPendingStatusList } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import { getDrawApplicationList } from "../services/DrawApplicationServices";

interface InitialState {
    instructions: string;
    successfulData: NonPendingStatusList;
    unsuccessfulData: NonPendingStatusList;
    pendingList: DrawResultsListItem[];
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
}

const initialState: InitialState = {
    instructions: "",
    successfulData: {},
    unsuccessfulData: {},
    pendingList: [],
    requestStatus: REQUEST_STATUS.idle,
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
            result = { ...dataFromAPI, offline: false };

            console.log("get draw application data from api", result);
        } else {
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
                if (!isEmpty(action?.payload.data)) {
                    const { successList, unSuccessList, pendingList, instructions } = action.payload.data;
                    state.successfulData = successList;
                    state.unsuccessfulData = unSuccessList;
                    state.pendingList = pendingList;
                    state.instructions = instructions;
                }
            } else {
                state.requestStatus = REQUEST_STATUS.rejected;
            }
        });
    },
});

const { actions, reducer } = drawApplicationSlice;

export { actions };
export default reducer;
