import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import appReducer from "./AppSlice";
import weatherReducer from "./WeatherSlice";
import profileReducer from "./ProfileSlice";
import licenseReducer from "./LicenseSlice";
import accountReducer from "./AccountSlice";

const store = configureStore({
    reducer: {
        app: appReducer,
        weather: weatherReducer,
        profile: profileReducer,
        license: licenseReducer,
        account: accountReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default store;
