import { createSlice } from "@reduxjs/toolkit";
import LoginStep from "../constants/LoginStep";
import { setActiveUserID } from "../helper/AppHelper";

const dialogObj = {
    visible: false,
    title: "",
    message: "",
    okText: "",
    okAction: () => {},
};

const initialState = {
    user: { username: "wzhao" },
    loginStep: LoginStep.login,
    indicator: false,
    simpleDialog: dialogObj,
    selectDialog: {
        ...dialogObj,
        cancelText: "",
        cancelAction: () => {},
    },
    localAuth: {
        available: false,
        typeName: "",
        enable: false,
    },
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateUser(state, action) {
            Object.assign(state, { user: action?.payload });
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
        setLocalAuth: (state, action) => {
            Object.assign(state, { localAuth: action.payload });
        },
    },
});

export const {
    updateUser,
    toggleIndicator,
    updateLoginStep,
    showSimpleDialog,
    hideSimpleDialog,
    showSelectDialog,
    hideSelectDialog,
    setLocalAuth,
} = appSlice.actions;

export const selectUsername = (state) => state.app.user.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectSimpleDialog = (state) => state.app.simpleDialog;
export const selectSelectDialog = (state) => state.app.selectDialog;
export const selectIndicator = (state) => state.app.indicator;
export const selectLocalAuth = (state) => state.app.localAuth;

const initUserData = (user) => async (dispatch) => {
    try {
        const { userID, primaryProfileId, otherProfileIds } = user;

        setActiveUserID(userID);
        dispatch(updateUser({ username: userID, primaryProfileId, otherProfileIds }));

        // TODO get user profiles
    } catch (error) {
        console.log("initUserData error", error);
    }
};

export const thunkActions = {
    initUserData,
};

const appReducer = appSlice.reducer;
export default appReducer;
