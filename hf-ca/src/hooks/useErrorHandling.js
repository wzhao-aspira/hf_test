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
import { globalDataForAPI, isNoAuthorization, isConnectError, isNotFindCustomerError } from "../network/commonUtil";
import AccountService from "../services/AccountService";
import Routers from "../constants/Routers";
import NavigationService from "../navigation/NavigationService";
import { clearProfileListUpdateTime } from "../helper/AutoRefreshHelper";
import { useDialog } from "../components/dialog/index";

export function getErrorMessage(error) {
    const errors = error.response?.data?.errors;
    if (isArray(errors) && errors.length > 0) {
        const errorMessages = errors.map((err) => Object.values(err).join()).join("\n");
        return errorMessages;
    }
    if (error.response?.data?.message) {
        return error.response?.data?.message;
    }
    return error?.message;
}

function getNetworkErrorMessage(t, error = {}) {
    const { networkErrorMsg } = error;
    if (isEmpty(networkErrorMsg)) {
        return t("errMsg.noNetworkDialog");
    }
    return networkErrorMsg;
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
    const showOfflineToast = useSelector(selectors.selectShowOfflineToast);
    const { openSimpleDialog } = useDialog();

    const isDownloadFile = error?.isDownloadFile;

    // use useEffect to avoid an error from react
    useEffect(() => {
        if (!isEmpty(error)) {
            if (isNoAuthorization(error)) {
                showToast(t("common.authenticationFailed"));
                AccountService.clearAppData(dispatch).then(() => {
                    dispatch(updateLoginStep(LoginStep.login));
                });
            } else if (isConnectError(error)) {
                console.log("api url with error:", error.config?.url);

                if (error.networkErrorByDialog) {
                    const message = getNetworkErrorMessage(t, error);
                    setTimeout(() => {
                        openSimpleDialog({
                            title: t("errMsg.noNetworkDialogTitle"),
                            message,
                            okText: "common.gotIt",
                            onConfirm: () => {
                                dispatch(appActions.clearError());
                            },
                        });
                    });
                } else if (showOfflineToast) {
                    // Toast only shows once for offline
                    const message = t("errMsg.noNetworkToast");
                    showToast(message, {
                        position: Toast.positions.CENTER,
                        opacity: 0.9,
                        duration: 3000,
                        backgroundColor: AppTheme.colors.font_color_3,
                    });
                    dispatch(appActions.setShowToastOffline(false));
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
                let message = getErrorMessage(error);
                if (error.code == "ECONNABORTED" || error.code == "ETIMEDOUT") {
                    message = t("errMsg.timeoutErrorMessage");
                }
                const canNotFindCustomer = isNotFindCustomerError(error);

                setTimeout(() => {
                    if (isDownloadFile) {
                        /**
                         * FIXME: It uses a workaround to avoid not showing an error message when the download request fails
                         * related ticket is AWO-218524
                         */
                        showToast(message, {
                            position: Toast.positions.CENTER,
                            opacity: 0.9,
                            duration: 3000,
                            backgroundColor: AppTheme.colors.font_color_3,
                        });
                    } else {
                        DialogHelper.showSimpleDialog({
                            title: "common.error",
                            okText: "common.gotIt",
                            message,
                            okAction: () => {
                                dispatch(appActions.clearError());
                                if (canNotFindCustomer) {
                                    clearProfileListUpdateTime();
                                    setTimeout(() => {
                                        NavigationService.navigate(Routers.manageProfile);
                                    });
                                }
                            },
                        });
                    }
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, error, showOfflineToast, t]);
}

export default useErrorHandling;
