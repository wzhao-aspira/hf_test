import React from "react";
import Routers from "../constants/Routers";
import NavigationService from "../navigation/NavigationService";

const DialogActions = {
    okAction: () => {},
    selOkAction: () => {},
    selCancelAction: () => {},
    renderContent: () => null,
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
    custom?: boolean;
    renderDialogContent?: () => React.FunctionComponent;
}

function showSimpleDialog(param: DialogParamInterface) {
    DialogActions.okAction = param.okAction;
    const copyed = { ...param, isSelect: false };
    delete copyed.okAction;
    NavigationService.push(Routers.modal, copyed);
}

function showSelectDialog(param: DialogParamInterface) {
    DialogActions.selCancelAction = param.cancelAction;
    DialogActions.selOkAction = param.okAction;
    const copyed = { ...param, isSelect: true };
    delete copyed.okAction;
    delete copyed.cancelAction;
    NavigationService.push(Routers.modal, copyed);
}

function showCustomDialog(param: DialogParamInterface) {
    DialogActions.renderContent = param.renderDialogContent;
    const copyed = { ...param, custom: true };
    delete copyed.renderDialogContent;
    NavigationService.push(Routers.modal, copyed);
}

export default {
    showSimpleDialog,
    showSelectDialog,
    showCustomDialog,
};
