import React, { createRef, useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import emailValidator from "email-validator";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import Page from "../../components/Page";
import { updateLoginStep, updateUsername } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import { SimpleDialog } from "../../components/Dialog";
import { validateRequiredInput, styles } from "./SignInUtils";
import { genTestId, setActiveUserID } from "../../helper/AppHelper";
import OnBoardingHelper from "../../helper/OnBoardingHelper";

const SignInScreen = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const sighInLable = t("login.signIn");
    const userIdEmptyMsg = t("signIn.userIdEmpty");
    const passwordEmptyMsg = t("signIn.passwordEmpty");

    const userIdRef = createRef();
    const passwordRef = createRef();
    const [userId, setUserId] = useState();
    const [password, setPassword] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const handleSignIn = async () => {
        const validateUserId = validateRequiredInput(userId, userIdRef, userIdEmptyMsg);
        const validatePassword = validateRequiredInput(password, passwordRef, passwordEmptyMsg);

        if (!validateUserId || !validatePassword) {
            return;
        }

        if (!emailValidator.validate(userId)) {
            setShowErrorDialog(true);
            setErrorMsg("signIn.userIdInvalid");
            return;
        }
        // TODO: accountNotFound validator
        // if (!validateProfile()) {
        //     setShowErrorDialog(true);
        //     setErrorMsg("signIn.accountNotFound");
        //     return;
        // }
        dispatch(updateUsername(userId));
        setActiveUserID(userId);
        const onBoardingScreens = await OnBoardingHelper.checkOnBoarding(userId);
        if (!isEmpty(onBoardingScreens)) {
            dispatch(updateLoginStep(LoginStep.onBoarding));
        } else {
            dispatch(updateLoginStep(LoginStep.home));
        }
    };

    return (
        <Page>
            <KeyboardAwareScrollView contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>{sighInLable}</Text>

                    <StatefulTextInput
                        ref={userIdRef}
                        value={userId}
                        label={t("signIn.userId")}
                        hint={`${t("signIn.userIdHint")} xx@xx.com`}
                        testID={genTestId("userIdInput")}
                        style={styles.marginTopStyle(20)}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        onChangeText={(text) => {
                            setUserId(text);
                            userIdRef.current?.setError({});
                        }}
                        onBlur={() => {
                            validateRequiredInput(userId, userIdRef, userIdEmptyMsg);
                        }}
                    />

                    <StatefulTextInput
                        ref={passwordRef}
                        value={password}
                        password
                        label={t("common.password")}
                        hint={t("common.pleaseEnter")}
                        note={t("common.forgotPassword")}
                        testID={genTestId("passwordInput")}
                        style={styles.marginTopStyle(20)}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        onClickNote={() => {}}
                        onChangeText={(text) => {
                            setPassword(text);
                            passwordRef.current?.setError({});
                        }}
                        onBlur={() => {
                            validateRequiredInput(password, passwordRef, passwordEmptyMsg);
                        }}
                    />

                    <PrimaryBtn style={styles.marginTopStyle(30)} label={sighInLable} onPress={handleSignIn} />

                    <Text testID={genTestId("signUpText")} style={styles.signUpStr}>
                        {t("signIn.noAccount")}
                        <Text
                            testID={genTestId("signUpLink")}
                            style={styles.signUpBtn}
                            onPress={() => {
                                dispatch(updateLoginStep(LoginStep.signUp));
                            }}
                        >
                            {` ${t("login.createAccount")}`}
                        </Text>
                    </Text>
                </View>
            </KeyboardAwareScrollView>

            {showErrorDialog && (
                <SimpleDialog
                    visible
                    title="common.error"
                    message={errorMsg}
                    okText="common.gotIt"
                    okAction={() => {
                        setShowErrorDialog(false);
                    }}
                />
            )}
        </Page>
    );
};

export default SignInScreen;
