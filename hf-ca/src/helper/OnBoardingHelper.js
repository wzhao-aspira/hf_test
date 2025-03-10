import * as Location from "expo-location";
import { isEmpty } from "lodash";
import { KEY_CONSTANT } from "../constants/Constants";
import { checkAuthOnboarding } from "./LocalAuthHelper";
import { retrieveItem } from "./StorageHelper";
import notifee, { AuthorizationStatus } from "@notifee/react-native";

export const OnboardingType = {
    biometricLogin: 1,
    location: 2,
    notification: 3,
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

        const onboardingNotificationPermission = await retrieveItem(KEY_CONSTANT.keyOnboardingNotificationPermission);
        if (onboardingNotificationPermission !== 1) {
            try {
                const settings = await notifee.getNotificationSettings();
                if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
                    console.log(`onboardingNotificationPermission:false`);
                    result.push(OnboardingType.notification);
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
