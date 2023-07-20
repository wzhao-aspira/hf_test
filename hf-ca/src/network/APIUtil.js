/* eslint-disable import/no-mutable-exports */
import { actions as appActions } from "../redux/AppSlice";

export let lastPromise;

export function clearLastPromise() {
    lastPromise = null;
}

export async function handleError(requestPromise, { showError = true, retry = false, dispatch } = {}) {
    try {
        lastPromise = null;
        if (retry) {
            lastPromise = requestPromise;
        }
        const response = await requestPromise;
        return response;
    } catch (error) {
        if (showError) dispatch(appActions.setError(error));
        console.log(JSON.stringify(error));
        return { success: false };
    }
}
