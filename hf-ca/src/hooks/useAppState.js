import { useEffect, useState } from "react";
import { AppState } from "react-native";

export default function useAppState(callback) {
    const [appState, setAppState] = useState("active");
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (callback) callback(nextAppState, appState);
            setAppState(nextAppState);
        };
        const sub = AppState.addEventListener("change", handleAppStateChange);
        return () => sub?.remove();
    });

    return appState;
}
