/* eslint-disable no-param-reassign */
import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
    showPrimaryProfileInactiveMsg: boolean;
}

const initialState: InitialState = {
    user: {},
    loginStep: LoginStep.login,
    indicator: false,
    error: {},
    showPrimaryProfileInactiveMsg: false,
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
    },
});

export const { updateUser, toggleIndicator, updateLoginStep, toggleShowPrimaryProfileInactiveMsg } = appSlice.actions;

const selectAppState = (/** @type{import('./Store').RootState */ state) => state.app;
export const selectUsername = (state) => state.app.user.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectIndicator = (state) => state.app.indicator;
export const selectIsPrimaryProfileInactive = createSelector(
    selectAppState,
    (state) => state.showPrimaryProfileInactiveMsg
);
export const selectError = createSelector(selectAppState, (state) => state.error);

const selectUser = createSelector(selectAppState, (app) => app.user);

const selectors = {
    selectUsername,
    selectUser,
    selectError,
};

const { reducer, actions } = appSlice;

export { actions, selectors };
export default reducer;
