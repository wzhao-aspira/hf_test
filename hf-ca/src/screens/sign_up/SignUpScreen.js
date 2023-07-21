import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader";
import SignUp from "./SignUp";
import Page from "../../components/Page";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import { updateLoginStep, selectLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import DialogHelper from "../../helper/DialogHelper";
import NavigationService from "../../navigation/NavigationService";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    contentContainerStyle: {
        paddingTop: 0,
        flexGrow: 1,
    },
});

function SignUpScreen() {
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const loginStep = useSelector(selectLoginStep);

    const onBackClick = () => {
        Keyboard.dismiss();
        DialogHelper.showSelectDialog({
            title: "signUp.exitSignUp",
            message: "signUp.areYouSureExitSignUp",
            okText: "common.yes",
            cancelText: "common.no",
            okAction: () => {
                if (loginStep == LoginStep.signIn) {
                    NavigationService.back();
                } else {
                    dispatch(updateLoginStep(LoginStep.login));
                }
            },
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader
                title={t("signUp.createMobileAccount")}
                onBackClick={() => {
                    onBackClick();
                }}
            />
            <Page>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        ...styles.contentContainerStyle,
                        paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
                    }}
                >
                    <View style={styles.page_container}>
                        <SignUp />
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
}

export default SignUpScreen;
