import { setActiveUserID } from "../helper/AppHelper";
import { actions as appActions } from "./AppSlice";

const initUserData =
    (user, saveToLocalStorage = true) =>
    async (dispatch) => {
        try {
            const { userID } = user;
            if (saveToLocalStorage) {
                setActiveUserID(userID);
            }
            dispatch(appActions.updateUser({ username: userID }));
        } catch (error) {
            console.log("initUserData error", error);
        }
    };

export default {
    initUserData,
};
