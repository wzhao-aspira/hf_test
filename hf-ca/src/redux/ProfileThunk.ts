import type { AppThunk } from "./Store";
import { getProfileListByIDs, updateCurrentInUseProfileID, getCurrentInUseProfileID } from "../services/ProfileService";
import { actions as profileActions } from "./ProfileSlice";
import { selectors as appSelectors } from "./AppSlice";
import { getLicense } from "./LicenseSlice";

const initProfile = (): AppThunk => async (dispatch, getState) => {
    const rootState = getState();
    const userState = appSelectors.selectUser(rootState);

    const { username, primaryProfileId, otherProfileIds } = userState;
    const profileListIDs = [primaryProfileId, ...otherProfileIds] as string[];

    const profileList = await getProfileListByIDs(profileListIDs);

    const currentInUseProfileID = await getCurrentInUseProfileID(username);

    if (currentInUseProfileID) {
        dispatch(profileActions.updateCurrentInUseProfileID(currentInUseProfileID));
    } else {
        updateCurrentInUseProfileID(username, primaryProfileId);
        dispatch(profileActions.updateCurrentInUseProfileID(primaryProfileId));
    }

    dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
    dispatch(profileActions.updateProfileIDs(profileListIDs));
    dispatch(profileActions.setProfileList(profileList));
};

const switchCurrentInUseProfile =
    (profileID): AppThunk =>
    async (dispatch, getState) => {
        const rootState = getState();
        const userState = appSelectors.selectUser(rootState);

        const { username } = userState;

        try {
            await updateCurrentInUseProfileID(username, profileID);
            dispatch(profileActions.updateCurrentInUseProfileID(profileID));
            // force update license by profileID when switch profile
            /* @ts-ignore */
            dispatch(getLicense({ isForce: true, searchParams: { activeProfileId: profileID } }));
        } catch (error) {
            // TODO: handle error
        }
    };

export default {
    initProfile,
    switchCurrentInUseProfile,
};
