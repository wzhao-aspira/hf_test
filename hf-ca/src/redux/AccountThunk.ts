import type { AppThunk } from "./Store";
import AccountService from "../services/AccountService";
import * as ProfileService from "../services/ProfileService";
import { selectors as appSelectors } from "./AppSlice";

type DeleteCurrentAccountResult = ReturnType<typeof AccountService.deleteCurrentAccount>;

const deleteCurrentAccount =
    (password: string): AppThunk<DeleteCurrentAccountResult> =>
    async (dispatch, getState) => {
        const rootState = getState();
        const accountID = appSelectors.selectUsername(rootState);

        try {
            const result = await AccountService.deleteCurrentAccount(password, { dispatch });

            if (result === "succeeded") {
                try {
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
