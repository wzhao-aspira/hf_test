import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import getWeatherDataFromService from "../services/WeatherService";
import { REQUEST_STATUS } from "../constants/Constants";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import { showToast } from "../helper/AppHelper";
import AppContract from "../assets/_default/AppContract";
import { handleError } from "../network/APIUtil";

const initialState = {
    weatherData: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    fahrenheitInd: AppContract.divisionCountry == "US",
};

export const getWeatherDataFromRedux = createAsyncThunk(
    "weather/getWeatherDataFromRedux",
    // eslint-disable-next-line no-empty-pattern
    async ({}, { dispatch }) => {
        console.log("Weather slice --- ready to get the weather data");
        return handleError(getWeatherDataFromService(), { showError: false, dispatch });
    },
    {
        condition: ({ isForce = false }, { getState }) => {
            const { weather } = getState();
            const { updateTime, requestStatus } = weather;
            if (requestStatus == REQUEST_STATUS.pending) {
                return false;
            }
            if (isForce) {
                return true;
            }
            return checkNeedAutoRefreshData(updateTime);
        },
    }
);

const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {
        updateFahrenheitInd: (state, action) => {
            Object.assign(state, { fahrenheitInd: action?.payload });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getWeatherDataFromRedux.rejected, (state, action) => {
            const error = action?.payload;
            if (error) showToast(error);
            Object.assign(state, { requestStatus: REQUEST_STATUS.rejected });
        });
        builder.addCase(getWeatherDataFromRedux.pending, (state) => {
            Object.assign(state, { requestStatus: REQUEST_STATUS.pending });
        });
        builder.addCase(getWeatherDataFromRedux.fulfilled, (state, action) => {
            const result = action?.payload;
            if (result.success) {
                const dateNow = moment().unix();
                Object.assign(state, {
                    weatherData: action?.payload?.data,
                    requestStatus: REQUEST_STATUS.fulfilled,
                    updateTime: dateNow,
                });
            } else {
                Object.assign(state, { requestStatus: REQUEST_STATUS.rejected });
            }
        });
    },
});

export const weather = (state) => state.weather;

export const { updateFahrenheitInd } = weatherSlice.actions;

const weatherReducer = weatherSlice.reducer;
export default weatherReducer;
