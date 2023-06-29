import {
    getMobileAccountById,
    deleteMobileAccount,
    checkMobileAccount,
    updateMobileAccountPasswordById,
} from "../helper/DBHelper";
import { getActiveUserID, setActiveUserID } from "../helper/AppHelper";

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
    const userID = await getActiveUserID();

    return verifyPassword(userID, currentAccountPassword);
}

async function deleteAccount(accountID: string, accountPassword: string) {
    try {
        const verifyPasswordResult = await verifyPassword(accountID, accountPassword);

        if (verifyPasswordResult === "passed") {
            const result = await deleteMobileAccount(accountID);

            if (result?.success) {
                setActiveUserID(null);
                return "succeeded";
            }
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
}

async function deleteCurrentAccount(currentAccountPassword) {
    const userID = await getActiveUserID();

    return deleteAccount(userID, currentAccountPassword);
}

async function isMobileAccountExisted(userID: string) {
    const result = await checkMobileAccount(userID);
    if (result.success && result.count > 0) {
        return true;
    }
    return false;
}

async function updateMobileAccountPasswordByUserId(userID: string, password: string) {
    return updateMobileAccountPasswordById(userID, password);
}

async function authSignin(userID, password) {
    const mobileAccount = await getMobileAccountById(userID);
    const userInfo = mobileAccount?.account;

    if (!userInfo || userInfo.password !== password) {
        return { success: false };
    }

    return { success: true, userInfo };
}

export default {
    verifyCurrentAccountPassword,
    deleteCurrentAccount,
    isMobileAccountExisted,
    updateMobileAccountPasswordByUserId,
    authSignin,
};
