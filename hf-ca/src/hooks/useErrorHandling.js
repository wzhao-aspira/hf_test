import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty, isArray } from "lodash";
import { actions as appActions, selectors, updateLoginStep } from "../redux/AppSlice";
import DialogHelper from "../helper/DialogHelper";
import LoginStep from "../constants/LoginStep";
import { globalDataForAPI, handleError } from "../network/APIUtil";
import { url } from "../network/identityAPI";
import AccountService from "../services/AccountService";

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
    const error = useSelector(selectors.selectError);

    // use useEffect to avoid an error from react
    useEffect(() => {
        if (!isEmpty(error)) {
            if (isNoAuthorization(error)) {
                AccountService.clearAppData(dispatch).then(() => {
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
