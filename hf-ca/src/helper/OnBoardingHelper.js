import * as Location from "expo-location";
import { isEmpty } from "lodash";
import { KEY_CONSTANT } from "../constants/Constants";
import { retrieveItem } from "./StorageHelper";

export const OnboardingType = {
    biometricLogin: 1,
    location: 2,
};

export default {
    checkOnBoarding: async () => {
        const result = [];
        const onboardingRecord = await retrieveItem(KEY_CONSTANT.keyOnboardingLocation);
        console.log(`onboardingRecord:${JSON.stringify(onboardingRecord)}`);
        if (isEmpty(onboardingRecord) || onboardingRecord.result == false) {
            try {
                const permissionResponse = await Location.getForegroundPermissionsAsync();
                console.log(`permissionResponse:${JSON.stringify(permissionResponse)}`);
                if (permissionResponse.status == "undetermined") {
                    result.push(OnboardingType.location);
                }
            } catch (error) {
                console.log(JSON.stringify(error));
            }
        }

        return new Promise((resolve) => {
            resolve(result);
        });
    },
};
