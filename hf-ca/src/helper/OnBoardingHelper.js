import * as Location from "expo-location";
import { isEmpty } from "lodash";
import { KEY_CONSTANT } from "../constants/Constants";
import { checkAuthOnboarding } from "./LocalAuthHelper";
import { retrieveItem } from "./StorageHelper";

export const OnboardingType = {
    biometricLogin: 1,
    location: 2,
};

export default {
    checkOnBoarding: async (userName) => {
        const result = [];
        const onboardingRecord = await retrieveItem(KEY_CONSTANT.keyOnboardingLocation);
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

        const needBiometricCheck = await checkAuthOnboarding(userName);
        if (needBiometricCheck) {
            result.push(OnboardingType.biometricLogin);
        }
        console.log(`onBoarding result:${JSON.stringify(result)}`);
        return result;
    },
};
