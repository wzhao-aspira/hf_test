import { setActiveUserID } from "../helper/AppHelper";
import profileThunkActions from "./ProfileThunk";
import { actions as appActions } from "./AppSlice";

const initUserData = (user) => async (dispatch) => {
    try {
        const { userID, primaryProfileId, otherProfileIds } = user;

        setActiveUserID(userID);
        dispatch(appActions.updateUser({ username: userID, primaryProfileId, otherProfileIds }));
        dispatch(profileThunkActions.initProfile());
    } catch (error) {
        console.log("initUserData error", error);
    }
};

export default {
    initUserData,
};
