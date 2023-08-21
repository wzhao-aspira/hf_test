import { getPreferencePoints } from "../network/api_client/PreferencePointsApi";

// eslint-disable-next-line import/prefer-default-export
export async function getPreferencePointsByProfileId(profileId: string) {
    return getPreferencePoints(profileId);
}
