import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty } from "lodash";
import { actions as appActions, selectors, updateLoginStep } from "../redux/AppSlice";
import DialogHelper from "../helper/DialogHelper";
import LoginStep from "../constants/LoginStep";
import { globalDataForAPI, handleError } from "../network/APIUtil";

function getErrorMessage(error) {
    return error?.message;
}

function isNoPermission(error) {
    let noPermission = false;
    if (error?.status === 401) {
        noPermission = true;
    }
    return noPermission;
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
    const error = useSelector(selectors.selectError);

    // use useEffect to avoid an error from react
    useEffect(() => {
        if (!isEmpty(error)) {
            const noPermission = isNoPermission(error);
            if (noPermission) {
                setTimeout(() => {
                    dispatch(updateLoginStep(LoginStep.login));
                });
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
    });
}

export default useErrorHandling;
