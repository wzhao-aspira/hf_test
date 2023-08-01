import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty, isArray } from "lodash";
import { actions as appActions, selectors, updateLoginStep } from "../redux/AppSlice";
import DialogHelper from "../helper/DialogHelper";
import LoginStep from "../constants/LoginStep";
import { globalDataForAPI, handleError, clearToken } from "../network/APIUtil";
import { url } from "../network/identityAPI";

const isErrorCode = (error, errorCode) => {
    if (error.status) {
        return error.status === errorCode;
    }
    if (error.response) {
        return error.response?.status === errorCode;
    }
    return false;
};

export const isNoAuthorization = (error) => {
    if (
        isErrorCode(error, 400) &&
        error.config?.url?.startsWith(url) &&
        error.config?.data?.includes("grant_type=refresh_token")
    ) {
        console.log("refresh token timeout");
        return true;
    }
    return isErrorCode(error, 401) && globalDataForAPI.jwtToken.access_token;
};

function getErrorMessage(error) {
    if (isArray(error.response?.data?.errors)) {
        return error.response?.data?.errors.join("\n");
    }
    if (error.response?.data?.error_description) {
        return error.response?.data?.error_description;
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
    const error = useSelector(selectors.selectError);

    // use useEffect to avoid an error from react
    useEffect(() => {
        if (!isEmpty(error)) {
            if (isNoAuthorization(error)) {
                clearToken();
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
    }, [dispatch, error]);
}

export default useErrorHandling;
