/* eslint-disable no-param-reassign */
import { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { DialogConfig } from "./type";

export const initialState: DialogConfig = {
    open: false,
};

export function dialogReducer(draft, action) {
    switch (action.type) {
        case "openDialog":
            draft = action.payload;
            break;
        case "closeDialog":
            draft = { open: false };
            break;
        default:
            break;
    }
    return draft;
}

export const DialogContext = createContext(null);

export function DialogProvider({ children }) {
    const [dialogState, dialogDispatch] = useImmerReducer(dialogReducer, initialState);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <DialogContext.Provider value={{ dialogState, dialogDispatch }}>{children}</DialogContext.Provider>
    );
}

export const useDialogContext = () => useContext(DialogContext);
