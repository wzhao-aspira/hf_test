import type { AppThunk } from "./Store";
import { getProfileListByIDs } from "../services/ProfileService";
import { actions as profileActions } from "./ProfileSlice";
import { selectors as appSelectors } from "./AppSlice";

const initProfile = (): AppThunk => async (dispatch, getState) => {
    const rootState = getState();
    const userState = appSelectors.selectUser(rootState);

    const { primaryProfileId, otherProfileIds } = userState;
    const profileListIDs = [primaryProfileId, ...otherProfileIds];

    const profileList = await getProfileListByIDs(profileListIDs);

    dispatch(profileActions.setProfileList(profileList));
    dispatch(profileActions.updateActiveProfileID(primaryProfileId)); // TODO: check logic
    dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
    dispatch(profileActions.updateOtherProfileIDs(otherProfileIds));
};

// const addProfile = (): AppThunk => async (dispatch, getState) => {};

export default {
    initProfile,
};
