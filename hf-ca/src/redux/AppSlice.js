/* eslint-disable no-param-reassign */
import { createSlice, createSelector } from "@reduxjs/toolkit";
import LoginStep from "../constants/LoginStep";

const initialState = {
    user: {},
    loginStep: LoginStep.login,
    indicator: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateUser(state, action) {
            Object.assign(state, { user: action?.payload });
        },
        resetUser(state) {
            state.user = initialState.user;
        },
        updateLoginStep(state, action) {
            Object.assign(state, { loginStep: action?.payload });
        },
        toggleIndicator: (state, action) => {
            Object.assign(state, { indicator: action?.payload });
        },
    },
});

export const { updateUser, toggleIndicator, updateLoginStep } = appSlice.actions;

const selectAppState = (/** @type{import('./Store').RootState */ state) => state.app;
export const selectUsername = (state) => state.app.user.username;
export const selectLoginStep = (state) => state.app.loginStep;
export const selectIndicator = (state) => state.app.indicator;

const selectUser = createSelector(selectAppState, (app) => app.user);

const selectors = {
    selectUsername,
    selectUser,
};

const { reducer, actions } = appSlice;

export { actions, selectors };
export default reducer;
