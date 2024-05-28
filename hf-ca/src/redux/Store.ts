import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import appReducer, { appInitialState } from "./AppSlice";
import weatherReducer from "./WeatherSlice";
import profileReducer from "./ProfileSlice";
import licenseReducer from "./LicenseSlice";
import accountReducer from "./AccountSlice";
import accessPermitReducer from "./AccessPermitSlice";
import preferencePointReducer from "./PreferencePointSlice";
import drawApplicationReducer from "./DrawApplicationSlice";
import { mobileAppAlertReducer } from "./MobileAppAlertSlice";

const myAppReducer = combineReducers({
    app: appReducer,
    accessPermit: accessPermitReducer,
    weather: weatherReducer,
    profile: profileReducer,
    license: licenseReducer,
    account: accountReducer,
    preferencePoint: preferencePointReducer,
    drawApplication: drawApplicationReducer,
    mobileAppAlert: mobileAppAlertReducer,
});

const rootReducer = (state, action) => {
    if (action.type === "USER_LOGOUT") {
        return myAppReducer(
            {
                app: appInitialState,
                accessPermit: undefined,
                weather: undefined,
                profile: undefined,
                license: undefined,
                account: undefined,
                preferencePoint: undefined,
                drawApplication: undefined,
                mobileAppAlert: undefined,
            },
            action
        );
    }

    return myAppReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default store;
