import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppContract from "../../assets/_default/AppContract";
import OnboardingLocationScreen from "./OnboardingLocationScreen";
import { updateLoginStep, selectUsername } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import OnBoardingHelper, { OnboardingType } from "../../helper/OnBoardingHelper";
import OnboardingBiometricIDScreen from "./OnboardingBiometricIDScreen";
import Page from "../../components/Page";
import { saveOnboardingPageAppear, setLoginCredential } from "../../helper/LocalAuthHelper";

export default function OnBoardingScreen() {
    const dispatch = useDispatch();
    const [location, setLocation] = useState(false);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [onBoardingTypes, setOnBoardingTypes] = useState([]);

    const userName = useSelector(selectUsername);

    const jump = () => {
        dispatch(updateLoginStep(LoginStep.home));
    };

    useEffect(() => {
        const checkVisibility = async () => {
            const result = await OnBoardingHelper.checkOnBoarding(userName);
            if (result.includes(OnboardingType.biometricLogin) && AppContract.function.biometric_enabled) {
                setBiometricLogin(true);
            } else if (result.includes(OnboardingType.location)) {
                setLocation(true);
            } else {
                jump();
            }
            setOnBoardingTypes(result);
        };

        checkVisibility();
    }, []);

    return (
        <Page style={{ paddingBottom: 0 }}>
            {biometricLogin && (
                <OnboardingBiometricIDScreen
                    userName={userName}
                    onFinish={(localAuthSet) => {
                        if (localAuthSet) {
                            setLoginCredential(userName);
                        }
                        saveOnboardingPageAppear(userName);
                        setBiometricLogin(false);
                        if (onBoardingTypes.includes(OnboardingType.location)) {
                            setLocation(true);
                        } else {
                            jump();
                        }
                    }}
                />
            )}
            {location && (
                <OnboardingLocationScreen
                    onFinish={() => {
                        jump();
                    }}
                />
            )}
        </Page>
    );
}
