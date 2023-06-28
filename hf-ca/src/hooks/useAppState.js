import { useEffect, useState } from "react";
import AppManager from "../helper/AppStateHelper";

export default function useAppState(callback) {
    const [appState, setAppState] = useState("active");
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            callback && callback(nextAppState, appState);
            setAppState(nextAppState);
        };
        const unSub = AppManager.addAppStateListener(handleAppStateChange);
        return () => unSub && unSub();
    });

    return appState;
}
