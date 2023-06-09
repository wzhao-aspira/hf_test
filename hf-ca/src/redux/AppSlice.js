import { createSlice } from "@reduxjs/toolkit";
import LoginStep from "../constants/LoginStep";

const initialState = { username: "wzhao", loginStep: LoginStep.login };

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateUsername(state, action) {
            Object.assign(state, { username: action?.payload });
        },
        updateLoginStep(state, action) {
            console.log(action);
            Object.assign(state, { loginStep: action?.payload });
            console.log("state", state);
        },
    },
});

export const { updateUsername, updateLoginStep } = appSlice.actions;

export const selectUsername = (state) => state.app.username;
export const selectLoginStep = (state) => state.app.loginStep;

const appReducer = appSlice.reducer;
export default appReducer;
