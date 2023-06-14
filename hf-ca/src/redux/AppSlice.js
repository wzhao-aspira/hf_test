import { createSlice } from "@reduxjs/toolkit";
import LoginStep from "../constants/LoginStep";

const initialState = {
    username: "wzhao",
    loginStep: LoginStep.login,
    simpleDialog: {
        visible: false,
        title: "",
        message: "",
        okText: "",
        okAction: () => {},
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
        showSimpleDialog: (state, action) => {
            Object.assign(state, { simpleDialog: { ...action.payload, visible: true } });
        },
        hideSimpleDialog: (state) => {
            Object.assign(state, { simpleDialog: { ...state.simpleDialog, visible: false } });
        },
    },
});

export const { updateUsername, updateLoginStep, showSimpleDialog, hideSimpleDialog } = appSlice.actions;

export const selectUsername = (state) => state.app.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectSimpleDialog = (state) => state.app.simpleDialog;

const appReducer = appSlice.reducer;
export default appReducer;
