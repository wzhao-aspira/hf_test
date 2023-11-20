import React from "react";

export interface DialogConfig {
    open: boolean;
    title?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    isSelect?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    renderContent?: () => React.FunctionComponent;
}

export interface SimpleDialogParam {
    title?: string;
    message?: string;
    okText?: string;
    onConfirm?: () => void;
}

export interface SelectDialogParam extends SimpleDialogParam {
    cancelText?: string;
    onCancel?: () => void;
}

export interface CustomDialogParam {
    renderContent?: () => React.FunctionComponent;
}
