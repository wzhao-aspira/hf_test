import preferencePointList from "./mock_data/preference_point.json";

// eslint-disable-next-line import/prefer-default-export
export async function getPreferencePointsByProfileId(profileId: string) {
    const result = preferencePointList
        .filter((item) => item.profileId === profileId)
        .sort((pointA, pointB) => pointA.drawType.localeCompare(pointB.drawType));

    return new Promise((res) => {
        setTimeout(() => res(result), 3000);
    });
}
