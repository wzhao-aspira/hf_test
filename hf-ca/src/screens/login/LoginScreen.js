import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import LoginStep from "../../constants/LoginStep";
import { updateLoginStep } from "../../redux/AppSlice";
import PrimaryBtn from "../../components/PrimaryBtn";
import AppContract from "../../assets/_default/AppContract";

export default function LoginScreen() {
    const dispatch = useDispatch();

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <PrimaryBtn label={AppContract.strings.sign_in} onPress={() => dispatch(updateLoginStep(LoginStep.home))} />
        </View>
    );
}
