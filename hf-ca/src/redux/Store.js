import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./AppSlice";
import weatherReducer from "./WeatherSlice";
import profileReducer from "./ProfileSlice";
import licenseReducer from "./LicenseSlice";

const store = configureStore({
    reducer: {
        app: appReducer,
        weather: weatherReducer,
        profile: profileReducer,
        license: licenseReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
