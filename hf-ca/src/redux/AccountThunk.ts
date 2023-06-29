import type { AppThunk } from "./Store";
import AccountService from "../services/AccountService";

const deleteCurrentAccount =
    (password: string): AppThunk<Promise<"succeeded" | "failed">> =>
    async (/* dispatch, getState */) => {
        try {
            const result = await AccountService.deleteCurrentAccount(password);

            if (result === "succeeded") {
                // TODO: delete the current account data from redux state and persistent database
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
