import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { isEmpty } from "lodash";
import getWeatherDataFromService from "../services/WeatherService";
import { REQUEST_STATUS } from "../constants/Constants";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import { showToast } from "../helper/AppHelper";
import AppContract from "../assets/_default/AppContract";

const initialState = {
    weatherData: null,
    requestStatus: REQUEST_STATUS.idle,
    updateTime: null,
    fahrenheitInd: AppContract.divisionCountry == "US",
};

export const getWeatherDataFromRedux = createAsyncThunk(
    "weather/getWeatherDataFromRedux",
    async ({ rejectWithValue }) => {
        const result = { success: false };
        try {
            console.log("Weather slice --- ready to get the weather data");
            const data = await getWeatherDataFromService();
            if (!isEmpty(data)) {
                result.success = true;
                result.data = data;
            }
            return result;
        } catch (error) {
            console.log("Weather slice --- get error", error);
            throw rejectWithValue(error);
        }
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
            showToast(error);
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
                showToast(AppContract.errors.can_not_get_weather_data);
                Object.assign(state, { requestStatus: REQUEST_STATUS.rejected });
            }
        });
    },
});

export const weather = (state) => state.weather;

export const { updateFahrenheitInd } = weatherSlice.actions;

const weatherReducer = weatherSlice.reducer;
export default weatherReducer;
