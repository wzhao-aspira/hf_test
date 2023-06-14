import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./AppSlice";
import weatherReducer from "./WeatherSlice";

const store = configureStore({
    reducer: {
        app: appReducer,
        weather: weatherReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
