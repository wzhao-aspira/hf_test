import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import Routers from "../constants/Routers";

function useFocus(action) {
    const actionRef = useRef(action);

    useEffect(() => {
        actionRef.current = action;
    }, [action]);

    const memAct = useCallback(() => {
        if (Routers.current === Routers.modal) {
            console.log("skip focus effect due to modal open...");
        } else {
            actionRef.current?.();
        }
    }, []);

    useFocusEffect(memAct);
}

export default useFocus;
