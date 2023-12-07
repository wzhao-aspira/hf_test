import type { AppThunk } from "./Store";
import AccountService from "../services/AccountService";

type DeleteCurrentAccountResult = ReturnType<typeof AccountService.deleteCurrentAccount>;

const deleteCurrentAccount =
    (password: string): AppThunk<DeleteCurrentAccountResult> =>
    async (dispatch) => {
        try {
            const result = await AccountService.deleteCurrentAccount(password, { dispatch });

            return result;
        } catch (error) {
            return "failed";
        }
    };

const thunkActions = {
    deleteCurrentAccount,
};

export default thunkActions;
