import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AppContract from "../../assets/_default/AppContract";
import OnboardingLocationScreen from "./OnboardingLocationScreen";
import { updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import OnBoardingHelper, { OnboardingType } from "../../helper/OnBoardingHelper";

export default function OnBoardingScreen() {
    const dispatch = useDispatch();
    const [location, setLocation] = useState(false);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [onBoardingTypes, setOnBoardingTypes] = useState([]);

    const jump = () => {
        dispatch(updateLoginStep(LoginStep.home));
    };

    useEffect(() => {
        const checkVisibility = async () => {
            const result = await OnBoardingHelper.checkOnBoarding();
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

    console.log(`location:${location}`);
    console.log(`biometricLogin:${biometricLogin}`);
    console.log(`onBoardingTypes:${onBoardingTypes}`);

    return (
        <View style={{ flex: 1 }}>
            {location && (
                <OnboardingLocationScreen
                    onFinish={() => {
                        jump();
                    }}
                />
            )}
        </View>
    );
}
