import { isEmpty } from "lodash";
import { actions as appActions } from "../redux/AppSlice";
import { globalDataForAPI, isConnectError, isBusinessErrorCode } from "./commonUtil";

export function clearLastPromise() {
    globalDataForAPI.lastPromise = null;
}

interface HandleErrorOptions {
    showError?: boolean;
    skippedBusinessErrorCode?: string;
    showLoading?: boolean;
    retry?: boolean;
    dispatch: any;
    networkErrorByDialog?: boolean;
    networkErrorMsg?: string;
}

export async function handleError<T>(
    requestPromise: T,
    {
        showError = true,
        skippedBusinessErrorCode = "", // allow a business error handling by user. It only takes effect when showError=true
        showLoading = false,
        retry = false,
        networkErrorByDialog = true,
        networkErrorMsg = "",
        dispatch,
    }: HandleErrorOptions
) {
    try {
        globalDataForAPI.lastPromise = null;
        if (retry) {
            // @ts-expect-error
            globalDataForAPI.lastPromise = requestPromise;
        }
        if (showLoading) {
            dispatch(appActions.toggleIndicator(true));
        }
        const response = await requestPromise;

        return { success: true, data: response };
    } catch (error) {
        if (showLoading) {
            dispatch(appActions.toggleIndicator(false));
        }

        if (
            showError &&
            (isEmpty(skippedBusinessErrorCode) ? true : !isBusinessErrorCode(error, skippedBusinessErrorCode))
        ) {
            dispatch(appActions.setError({ ...error, networkErrorByDialog, networkErrorMsg }));
        }
        console.log(error);

        const isNetworkError = isConnectError(error);
        return { success: false, isNetworkError, error };
    } finally {
        if (showLoading) {
            dispatch(appActions.toggleIndicator(false));
        }
    }
}
