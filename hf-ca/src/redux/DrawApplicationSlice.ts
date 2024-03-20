import type { RootState } from "./Store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { DrawTabData, DrawApplicationList } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import { getDrawApplicationList } from "../services/DrawApplicationServices";
import { getDrawApplicationDataFromDB } from "../db";
import convertDrawResultsListToDrawApplicationList from "../screens/draw_application/detail/utils/convertDrawResultsListToDrawApplicationList";
import { folderName } from "../screens/draw_application/detail/DrawApplicationDetailScreen";
import cleanUpInvalidFiles from "../components/notificationAndAttachment/utils/cleanUpInvalidFiles";
import { selectors as profileSelectors } from "./ProfileSlice";

interface InitialState {
    instructions: string;
    successfulData: DrawTabData;
    historicalSuccessfulData: DrawTabData;
    unsuccessfulData: DrawTabData;
    historicalUnsuccessfulData: DrawTabData;
    pendingData: DrawTabData;
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    isUseCacheData: boolean;
    noCacheData: boolean;
    lastUpdateDate: string;
}

const initialState: InitialState = {
    instructions: "",
    successfulData: {},
    historicalSuccessfulData: {},
    unsuccessfulData: {},
    historicalUnsuccessfulData: {},
    pendingData: {},
    requestStatus: REQUEST_STATUS.idle,
    isUseCacheData: false,
    noCacheData: false,
    lastUpdateDate: "",
};

function getDrawApplicationDownloadableFileIDList(drawApplicationList: DrawApplicationList) {
    const { successList, unSuccessList } = drawApplicationList;

    if (
        Array.isArray(successList?.copyHuntsList) &&
        Array.isArray(unSuccessList?.copyHuntsList) &&
        Array.isArray(successList?.generatedHuntsList)
    ) {
        const copyHuntsList = [
            ...successList.copyHuntsList.flatMap((item) => item?.items),
            ...unSuccessList.copyHuntsList.flatMap((item) => item?.items),
        ];
        const generatedHuntsList = [...successList.generatedHuntsList, ...unSuccessList.generatedHuntsList];

        const drawApplicationItemList = [...copyHuntsList.flat(), ...generatedHuntsList];

        const fileInfoList = convertDrawResultsListToDrawApplicationList(drawApplicationItemList).flatMap(
            (item) => item.fileInfoList
        );

        const downloadableFileIDList = fileInfoList.map((fileInfo) => fileInfo.id).filter((fileID) => fileID);

        return downloadableFileIDList;
    }

    return null;
}

export const getDrawList = createAsyncThunk(
    "drawApplication/getDrawList",
    async (
        {
            profileId,
            showError = true,
        }: {
            profileId: string;
            showError?: boolean;
        },
        { dispatch, getState }
    ) => {
        let result;

        const dataFromAPI = await handleError(getDrawApplicationList(profileId), {
            dispatch,
            networkErrorByDialog: false,
            showError,
        });
        if (dataFromAPI.success) {
            result = { ...dataFromAPI, isUseCacheData: false };
            console.log("get draw application data from api");

            const downloadableFileIDList = getDrawApplicationDownloadableFileIDList(result.data);

            const currentInUseProfileID = profileSelectors.selectCurrentInUseProfileID(getState() as RootState);
            cleanUpInvalidFiles({ downloadableFileIDList, folderName, profileID: currentInUseProfileID });
        } else {
            const data = await getDrawApplicationDataFromDB(profileId);
            result = { success: true, data, isUseCacheData: true };
            console.log("get draw application data from db");
        }

        return result;
    },
    {
        condition: (_, { getState }) => {
            const rs: RootState = getState() as RootState;
            if (rs.drawApplication.requestStatus == REQUEST_STATUS.pending) {
                console.log("drawApplication.requestStatus == REQUEST_STATUS.pending, Skip request this time...");
                return false;
            }
            return true;
        },
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
                    const {
                        successList,
                        unSuccessList,
                        historySuccessList,
                        historyUnSuccessList,
                        pendingList,
                        instructions,
                        lastUpdateDate,
                    } = result.data;
                    state.successfulData = successList;
                    state.historicalSuccessfulData = historySuccessList;
                    state.historicalUnsuccessfulData = historyUnSuccessList;
                    state.unsuccessfulData = unSuccessList;
                    state.pendingData = pendingList;
                    state.instructions = instructions;
                    state.noCacheData = false;
                    state.lastUpdateDate = lastUpdateDate;
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
