import countryStateMockData from "./mock_data/country_states.json";
import identificationTypesMockData from "./mock_data/identification_types.json";
import identificationOwnersMockData from "./mock_data/identification_owners.json";
import profileList from "./mock_data/profiles.json";

export async function getProfileList() {
    return new Promise((res) => {
        setTimeout(() => res(profileList), 2000);
    });
}

export async function getCountriesStates() {
    return new Promise((res) => {
        setTimeout(() => res(countryStateMockData), 500);
    });
}

export async function getIdentificationTypes() {
    return new Promise((res) => {
        setTimeout(() => res(identificationTypesMockData), 500);
    });
}

export async function getIdentificationOwners() {
    return new Promise((res) => {
        setTimeout(() => res(identificationOwnersMockData), 500);
    });
}

export async function saveProfile(profile) {
    console.log(profile);
}
