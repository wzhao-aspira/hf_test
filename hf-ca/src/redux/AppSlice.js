import { createSlice } from "@reduxjs/toolkit";
import LoginStep from "../constants/LoginStep";

const dialogObj = {
    visible: false,
    title: "",
    message: "",
    okText: "",
    okAction: () => {},
};

const initialState = {
    username: "wzhao",
    loginStep: LoginStep.login,
    indicator: false,
    simpleDialog: dialogObj,
    selectDialog: {
        ...dialogObj,
        cancelText: "",
        cancelAction: () => {},
    },
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateUsername(state, action) {
            Object.assign(state, { username: action?.payload });
        },
        updateLoginStep(state, action) {
            Object.assign(state, { loginStep: action?.payload });
        },
        toggleIndicator: (state, action) => {
            Object.assign(state, { indicator: action?.payload });
        },
        showSimpleDialog: (state, action) => {
            Object.assign(state, { simpleDialog: { ...action.payload, visible: true } });
        },
        hideSimpleDialog: (state) => {
            Object.assign(state, { simpleDialog: { ...state.simpleDialog, visible: false } });
        },
        showSelectDialog: (state, action) => {
            Object.assign(state, { selectDialog: { ...action.payload, visible: true } });
        },
        hideSelectDialog: (state) => {
            Object.assign(state, { selectDialog: { ...state.selectDialog, visible: false } });
        },
    },
});

export const {
    updateUsername,
    toggleIndicator,
    updateLoginStep,
    showSimpleDialog,
    hideSimpleDialog,
    showSelectDialog,
    hideSelectDialog,
} = appSlice.actions;

export const selectUsername = (state) => state.app.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectSimpleDialog = (state) => state.app.simpleDialog;
export const selectSelectDialog = (state) => state.app.selectDialog;
export const selectIndicator = (state) => state.app.indicator;

const appReducer = appSlice.reducer;
export default appReducer;
