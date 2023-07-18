import Routers from "../constants/Routers";
import NavigationService from "../navigation/NavigationService";

const DialogActions = {
    okAction: () => {},
    selOkAction: () => {},
    selCancelAction: () => {},
};

export { DialogActions };

interface DialogParamInterface {
    title?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    okAction?: () => void;
    cancelAction: () => void;
    withModal?: boolean;
}

function showSimpleDialog(param: DialogParamInterface) {
    DialogActions.okAction = param.okAction;
    const copyed = { ...param, isSelect: false };
    delete copyed.okAction;
    NavigationService.navigate(Routers.modal, copyed);
}

function showSelectDialog(param: DialogParamInterface) {
    DialogActions.selCancelAction = param.cancelAction;
    DialogActions.selOkAction = param.okAction;
    const copyed = { ...param, isSelect: true };
    delete copyed.okAction;
    delete copyed.cancelAction;
    NavigationService.navigate(Routers.modal, copyed);
}

export default {
    showSimpleDialog,
    showSelectDialog,
};
