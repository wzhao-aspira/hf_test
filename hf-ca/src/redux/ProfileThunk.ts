import type { AppThunk } from "./Store";
import { updateCurrentInUseProfileID, getCurrentInUseProfileID, getProfileList } from "../services/ProfileService";
import { actions as profileActions } from "./ProfileSlice";
import { selectors as appSelectors } from "./AppSlice";
import { getLicense } from "./LicenseSlice";
import { handleError } from "../network/APIUtil";

const initProfile = (): AppThunk => async (dispatch, getState) => {
    const rootState = getState();
    const userState = appSelectors.selectUser(rootState);

    const { username } = userState;

    const profileListIDs = [];
    let primaryProfileId: string;

    const response = await handleError(getProfileList(), { dispatch });
    if (!response.success) {
        return;
    }

    const { result } = response.data.data;
    const profileList = result.map((item) => {
        if (item.isPrimary) {
            primaryProfileId = item.customerId;
        }

        profileListIDs.push(item.customerId);
        return {
            profileId: item.customerId,
            displayName: item.name,
            profileType: item.customerTypeId,
            goIDNumber: item.goid,
        };
    });

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
