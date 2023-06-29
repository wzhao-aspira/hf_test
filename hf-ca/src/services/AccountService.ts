import { getUserID } from "../helper/LocalAuthHelper";
import { getMobileAccountById, deleteMobileAccount } from "../helper/DBHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { storeItem } from "../helper/StorageHelper";

async function verifyPassword(accountID: string, accountPassword: string) {
    try {
        if (accountID) {
            if (!accountPassword) return "failed: password is empty";

            const accountData = await getMobileAccountById(accountID);
            const password = accountData?.account?.password;

            if (accountPassword !== password) return "failed: password do not match";

            return "passed";
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
}

async function verifyCurrentAccountPassword(currentAccountPassword) {
    const userID = await getUserID();

    return verifyPassword(userID, currentAccountPassword);
}

async function deleteAccount(accountID: string, accountPassword: string) {
    try {
        const verifyPasswordResult = await verifyPassword(accountID, accountPassword);

        if (verifyPasswordResult === "passed") {
            const result = await deleteMobileAccount(accountID);

            if (result?.success) {
                await storeItem(KEY_CONSTANT.keyLastUsedMobileAccountId, null);
                return "succeeded";
            }
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
}

async function deleteCurrentAccount(currentAccountPassword) {
    const userID = await getUserID();

    return deleteAccount(userID, currentAccountPassword);
}

export default {
    verifyCurrentAccountPassword,
    deleteCurrentAccount,
};
