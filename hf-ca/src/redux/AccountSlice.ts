import { createSlice } from "@reduxjs/toolkit";
import thunkActions from "./AccountThunk";

const initialState = {};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {},
});

const { reducer, actions } = accountSlice;

export { actions, thunkActions };
export default reducer;
