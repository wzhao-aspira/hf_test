import { setActiveUserID } from "../helper/AppHelper";
import { actions as appActions } from "./AppSlice";

const initUserData = (user) => async (dispatch) => {
    try {
        const { userID } = user;
        setActiveUserID(userID);
        dispatch(appActions.updateUser({ username: userID }));
    } catch (error) {
        console.log("initUserData error", error);
    }
};

export default {
    initUserData,
};
