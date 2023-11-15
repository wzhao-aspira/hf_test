/* eslint-disable no-param-reassign */
import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import LoginStep from "../constants/LoginStep";
import { isConnectError } from "../network/commonUtil";

interface User {
    username?: string;
}
interface InitialState {
    user: User;
    loginStep: number;
    indicator: boolean;
    error: any;
    showOfflineToast: boolean;
    showPrimaryProfileInactiveMsg: boolean;
    primaryInactivatedWhenSignIn: boolean;
    currentRouter: string;
}

const initialState: InitialState = {
    user: {},
    loginStep: LoginStep.splash,
    indicator: false,
    error: {},
    showOfflineToast: true,
    showPrimaryProfileInactiveMsg: false,
    primaryInactivatedWhenSignIn: false,
    currentRouter: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setError(state, action) {
            if (!isConnectError(state.error) || !isConnectError(action?.payload)) {
                state.error = action?.payload;
            }
        },
        setShowToastOffline(state, action) {
            state.showOfflineToast = action?.payload;
        },
        clearError(state) {
            state.error = {};
        },
        updateUser(state, action: PayloadAction<User>) {
            Object.assign(state, { user: action?.payload });
        },
        resetUser(state) {
            state.user = initialState.user;
        },
        updateLoginStep(state, action: PayloadAction<number>) {
            Object.assign(state, { loginStep: action?.payload });
        },
        toggleIndicator: (state, action: PayloadAction<boolean>) => {
            state.indicator = action?.payload;
        },
        toggleShowPrimaryProfileInactiveMsg: (state, action: PayloadAction<boolean>) => {
            state.showPrimaryProfileInactiveMsg = action?.payload;
        },
        togglePrimaryInactivatedWhenSignIn: (state, action: PayloadAction<boolean>) => {
            state.primaryInactivatedWhenSignIn = action?.payload;
        },
        setCurrentRouter: (state, action: PayloadAction<string>) => {
            state.currentRouter = action?.payload;
        },
    },
});

export const {
    updateUser,
    toggleIndicator,
    updateLoginStep,
    toggleShowPrimaryProfileInactiveMsg,
    togglePrimaryInactivatedWhenSignIn,
} = appSlice.actions;

const selectAppState = (/** @type{import('./Store').RootState */ state) => state.app;
export const selectUsername = (state) => state.app.user.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectIndicator = (state) => state.app.indicator;
export const selectIsPrimaryProfileInactive = createSelector(
    selectAppState,
    (state) => state.showPrimaryProfileInactiveMsg
);
export const selectPrimaryInactivatedWhenSignIn = createSelector(
    selectAppState,
    (state) => state.primaryInactivatedWhenSignIn
);
export const selectError = createSelector(selectAppState, (state) => state.error);
export const selectCurrentRouter = createSelector(selectAppState, (app) => app.currentRouter);
export const selectShowOfflineToast = createSelector(selectAppState, (app) => app.showOfflineToast);
export const selectShowNetErrorByDialog = createSelector(selectError, (error) => error.networkErrorByDialog);
export const selectErrorIsNetError = createSelector(selectError, (error) => {
    const isNetError = !isEmpty(error) && isConnectError(error);
    return isNetError;
});

const selectUser = createSelector(selectAppState, (app) => app.user);
const selectors = {
    selectUsername,
    selectUser,
    selectError,
    selectErrorIsNetError,
    selectShowOfflineToast,
    selectShowNetErrorByDialog,
    selectCurrentRouter,
};

const { reducer, actions } = appSlice;

export { actions, selectors };
export default reducer;
