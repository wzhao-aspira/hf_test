import React from "react";
import Routers from "../constants/Routers";
import NavigationService from "../navigation/NavigationService";
import { SplashStatus } from "./AppHelper";

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
    cancelAction?: () => void;
    withModal?: boolean;
    custom?: boolean;
    renderDialogContent?: () => React.FunctionComponent;
}

let showSimpleDialogTimeout;

function showSimpleDialog(param: DialogParamInterface) {
    if (SplashStatus.show) {
        console.log("splash shown, delay SimpleDialog some time...");
        clearTimeout(showSimpleDialogTimeout);
        showSimpleDialogTimeout = setTimeout(() => {
            showSimpleDialog(param);
        }, 500);
        return;
    }
    DialogActions.okAction = param.okAction;
    const copyed = { ...param, isSelect: false };
    delete copyed.okAction;
    NavigationService.push(Routers.modal, copyed);
}

let showSelectDialogTimeout;
function showSelectDialog(param: DialogParamInterface) {
    if (SplashStatus.show) {
        console.log("splash shown, delay SelectDialog some time...");
        clearTimeout(showSelectDialogTimeout);
        showSelectDialogTimeout = setTimeout(() => {
            showSelectDialog(param);
        }, 500);
        return;
    }
    DialogActions.selCancelAction = param.cancelAction;
    DialogActions.selOkAction = param.okAction;
    const copyed = { ...param, isSelect: true };
    delete copyed.okAction;
    delete copyed.cancelAction;
    NavigationService.push(Routers.modal, copyed);
}

let showCustomDialogTimeout;
function showCustomDialog(param: DialogParamInterface) {
    if (SplashStatus.show) {
        console.log("splash shown, delay CustomDialog some time...");
        clearTimeout(showCustomDialogTimeout);
        showCustomDialogTimeout = setTimeout(() => {
            showCustomDialog(param);
        }, 500);
        return;
    }
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
