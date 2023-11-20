import { useDialogContext } from "./DialogManager";
import { SimpleDialogParam, SelectDialogParam, CustomDialogParam } from "./type";

const useDialog = () => {
    const { dialogState, dialogDispatch } = useDialogContext();

    const closeDialog = () => {
        dialogDispatch({ type: "closeDialog" });
    };

    const openSimpleDialog = (configData: SimpleDialogParam) => {
        dialogDispatch({ type: "openDialog", payload: { ...configData, open: true } });
    };

    const openSelectDialog = (configData: SelectDialogParam) => {
        dialogDispatch({ type: "openDialog", payload: { ...configData, open: true, isSelect: true } });
    };

    const openCustomDialog = (configData: CustomDialogParam) => {
        dialogDispatch({ type: "openDialog", payload: { ...configData, open: true } });
    };

    return {
        openSimpleDialog,
        openSelectDialog,
        openCustomDialog,
        closeDialog,
        dialogState,
        dialogDispatch,
    };
};
export default useDialog;
