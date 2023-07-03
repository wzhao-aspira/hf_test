import type { AppThunk } from "./Store";
import AccountService from "../services/AccountService";
import * as ProfileService from "../services/ProfileService";
import { actions as appActions, selectors as appSelectors } from "./AppSlice";
import { actions as profileActions } from "./ProfileSlice";

const deleteCurrentAccount =
    (password: string): AppThunk<Promise<"succeeded" | "failed">> =>
    async (dispatch, getState) => {
        const rootState = getState();
        const accountID = appSelectors.selectUsername(rootState);

        try {
            const result = await AccountService.deleteCurrentAccount(password);

            if (result === "succeeded") {
                dispatch(appActions.resetUser());
                dispatch(profileActions.restProfileToInitialState());

                try {
                    // TODO: reset local auth data from the storage
                    await ProfileService.removeAccountCurrentInUseProfileID(accountID);
                } catch (error) {
                    // TODO: handle error
                }
            }

            return result;
        } catch (error) {
            return "failed";
        }
    };

const thunkActions = {
    deleteCurrentAccount,
};

export default thunkActions;
