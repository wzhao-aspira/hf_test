import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty, isArray } from "lodash";
import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";
import { actions as appActions, selectors, updateLoginStep } from "../redux/AppSlice";
import DialogHelper from "../helper/DialogHelper";
import { showToast } from "../helper/AppHelper";
import LoginStep from "../constants/LoginStep";
import AppTheme from "../assets/_default/AppTheme";
import { handleError } from "../network/APIUtil";
import { globalDataForAPI, isNoAuthorization, isConnectError } from "../network/commonUtil";
import AccountService from "../services/AccountService";

export function getErrorMessage(error) {
    const errors = error.response?.data?.errors;
    if (isArray(errors) && errors.length > 0) {
        const errorMessages = errors.map((err) => Object.values(err).join()).join("\n");
        return errorMessages;
    }
    return error?.message;
}

function retryRequest(error, okAction, cancelAction) {
    DialogHelper.showSelectDialog({
        okText: "common.retry",
        cancelText: "common.cancel",
        title: "common.error",
        message: error.message,
        cancelAction: () => {
            if (cancelAction) {
                cancelAction();
            }
        },
        okAction: () => {
            setTimeout(() => {
                if (okAction) {
                    okAction();
                }
            });
        },
    });
}

function useErrorHandling() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const error = useSelector(selectors.selectError);

    // use useEffect to avoid an error from react
    useEffect(() => {
        if (!isEmpty(error)) {
            if (isNoAuthorization(error)) {
                showToast(t("common.authenticationFailed"));
                AccountService.clearAppData(dispatch).then(() => {
                    dispatch(updateLoginStep(LoginStep.login));
                });
            } else if (isConnectError(error)) {
                if (globalDataForAPI.networkErrorByDialog) {
                    DialogHelper.showSimpleDialog({
                        title: t("errMsg.noNetworkDialogTitle"),
                        message: t("errMsg.noNetworkDialog"),
                        okAction: () => {
                            dispatch(appActions.clearError());
                        },
                    });
                } else {
                    const message = t("errMsg.noNetworkToast");
                    showToast(message, {
                        position: Toast.positions.CENTER,
                        opacity: 0.9,
                        duration: 3000,
                        backgroundColor: AppTheme.colors.font_color_3,
                        onShown: () => {
                            dispatch(appActions.clearError());
                        },
                    });
                }
            } else if (globalDataForAPI.lastPromise) {
                retryRequest(
                    error,
                    () => {
                        dispatch(appActions.clearError());
                        handleError(globalDataForAPI.lastPromise, { showError: true, retry: true, dispatch });
                    },
                    () => {
                        dispatch(appActions.clearError());
                    }
                );
            } else {
                const message = getErrorMessage(error);
                DialogHelper.showSimpleDialog({
                    title: "common.error",
                    message,
                    okAction: () => {
                        dispatch(appActions.clearError());
                    },
                });
            }
        }
    }, [dispatch, error, t]);
}

export default useErrorHandling;
