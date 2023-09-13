import moment from "moment";

const refreshTime = {
    profileList: null,
    preferencePointList: {},
};

export function getProfileListUpdateTime() {
    return refreshTime.profileList;
}

export function setProfileListUpdateTime() {
    refreshTime.profileList = moment().unix();
}

export function getPreferencePointListUpdateTime(profileId) {
    let result = null;
    if (refreshTime.preferencePointList[profileId]) {
        result = refreshTime.preferencePointList[profileId];
    }

    return result;
}

export function setPreferencePointListUpdateTime(profileId) {
    refreshTime.preferencePointList[profileId] = moment().unix();
}

export function resetRefreshTime() {
    refreshTime.profileList = null;
    refreshTime.preferencePointList = {};
}
