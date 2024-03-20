import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccessPermitData } from "../services/AccessPermitServices";
import { REQUEST_STATUS } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import ValueOf from "../types/valueOf";
import { AccessPermit, AccessPermitItem } from "../types/accessPermit";
import { saveAccessPermitDataToDB, getAccessPermitDataFromDB } from "../db";
import cleanUpInvalidFiles from "../components/notificationAndAttachment/utils/cleanUpInvalidFiles";
import { folderName } from "../screens/access_permits/AccessPermitDetailScreen";
import { selectors as profileSelectors } from "./ProfileSlice";

import type { RootState } from "./Store";

interface AccessPermitState {
    data: AccessPermit;
    requestStatus: ValueOf<typeof REQUEST_STATUS>;
    offline: boolean;
}

const initialState: AccessPermitState = { data: null, requestStatus: REQUEST_STATUS.idle, offline: false };

function getAccessPermitDownloadableFileIDList(accessPermitsData: AccessPermitItem[]) {
    if (!accessPermitsData) {
        return null;
    }

    const fileInfoList = accessPermitsData.flatMap((accessPermit) =>
        accessPermit.huntDays.flatMap((huntDay) => huntDay.fileInfoList)
    );

    const downloadableFileIDList = fileInfoList.map((fileInfo) => fileInfo.id).filter((fileID) => fileID);

    return downloadableFileIDList;
}

export const getAccessPermit = createAsyncThunk<
    any,
    { searchParams: { activeProfileId: string }; showError: boolean },
    { state: RootState }
>(
    "accessPermit/getAccessPermit",
    async ({ searchParams, showError = true }, { dispatch, getState }) => {
        let result;

        const dataFromAPI = await handleError(getAccessPermitData(searchParams), {
            dispatch,
            networkErrorByDialog: false,
            showError,
        });

        console.log("getAccessPermit dataFromAPI");

        const { activeProfileId } = searchParams;

        if (dataFromAPI.success) {
            result = { ...dataFromAPI, offline: false };
            const dataForOffline = { ...dataFromAPI.data, profileId: activeProfileId };
            await saveAccessPermitDataToDB(dataForOffline);
            console.log("get access permit data from api");

            const downloadableFileIDList = getAccessPermitDownloadableFileIDList(dataFromAPI?.data?.accessPermits);

            const currentInUseProfileID = profileSelectors.selectCurrentInUseProfileID(getState());
            cleanUpInvalidFiles({ folderName, downloadableFileIDList, profileID: currentInUseProfileID });
        } else {
            const data = await getAccessPermitDataFromDB(activeProfileId);
            result = { success: true, data, offline: true };
            console.log("get access permit data from db");
        }

        console.log("getAccessPermit result");

        return result;
    },
    {
        condition: (actionPayload, { getState }) => {
            const { accessPermit } = getState();
            const { requestStatus } = accessPermit as AccessPermitState;

            if (requestStatus == REQUEST_STATUS.pending) {
                return false;
            }

            return true;
        },
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
