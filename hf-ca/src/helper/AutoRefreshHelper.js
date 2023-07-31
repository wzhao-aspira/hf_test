import moment from "moment";

const refreshTime = {
    profileList: null,
};

export function getProfileListUpdateTime() {
    return refreshTime.profileList;
}

export function setProfileListUpdateTime() {
    refreshTime.profileList = moment().unix();
}
