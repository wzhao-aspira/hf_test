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
import { actions as appActions, updateLoginStep } from "../../redux/AppSlice";
import appThunkActions from "../../redux/AppThunk";
import LoginStep from "../../constants/LoginStep";
import { SimpleDialog } from "../../components/Dialog";
import { validateRequiredInput, styles } from "./SignInUtils";
import { genTestId, isIos } from "../../helper/AppHelper";
import OnBoardingHelper from "../../helper/OnBoardingHelper";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import AccountService from "../../services/AccountService";
import BiometricLoginBtn from "../../components/BiometricLoginBtn";
import { resetBiometricIDLoginBlock, setLoginCredential, setPasswordChangeInd } from "../../helper/LocalAuthHelper";
import { handleError } from "../../network/APIUtil";
import ProfileThunk from "../../redux/ProfileThunk";
import { actions as ProfileActions } from "../../redux/ProfileSlice";

function SignInScreen(route) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const sighInLabel = t("login.signIn");
    const userIdEmptyMsg = t("signIn.userIdEmpty");
    const passwordEmptyMsg = t("signIn.passwordEmpty");

    const userIdRef = createRef();
    const passwordRef = createRef();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState();
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const doSignIn = async (uid = userId, pwd = password) => {
        passwordRef.current?.setSecureEntry();

        const response = await handleError(AccountService.authSignIn(uid, pwd), { dispatch, showLoading: true });
        if (!response.success) {
            return;
        }

        await dispatch(appThunkActions.initUserData({ userID: uid }));
        await setLoginCredential(uid, pwd);

        const profileResponse = await dispatch(ProfileThunk.initProfile());

        // Clean the password change indicator
        await setPasswordChangeInd(uid, false);
        resetBiometricIDLoginBlock(uid);
        const onBoardingScreens = await OnBoardingHelper.checkOnBoarding(uid);
        if (!isEmpty(onBoardingScreens)) {
            dispatch(updateLoginStep(LoginStep.onBoarding));
        } else {
            dispatch(updateLoginStep(LoginStep.home));
        }

        if (profileResponse.success && !profileResponse.primaryProfileId) {
            await dispatch(ProfileActions.setIndividualProfiles(profileResponse.profileList));
            dispatch(appActions.togglePrimaryInactivatedWhenSignIn(true));
        }
    };

    const clickSignIn = async () => {
        const trimmedUsedId = userId.trim();
        const validateUserId = validateRequiredInput(trimmedUsedId, userIdRef, userIdEmptyMsg);
        const validatePassword = validateRequiredInput(password, passwordRef, passwordEmptyMsg);

        if (!validateUserId || !validatePassword) {
            return;
        }

        if (!emailValidator.validate(trimmedUsedId)) {
            setShowErrorDialog(true);
            setErrorMsg("signIn.userIdInvalid");
            return;
        }

        doSignIn(trimmedUsedId);
    };

    return (
        <Page style={styles.signInPage}>
            <KeyboardAwareScrollView contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>{sighInLabel}</Text>
                    <StatefulTextInput
                        textContentType={isIos() ? "username" : "none"}
                        keyboardType={isIos() ? "email-address" : "ascii-capable"}
                        ref={userIdRef}
                        value={userId}
                        label={t("signIn.userId")}
                        hint={`${t("signIn.userIdHint")} xx@xx.com`}
                        testID="userIdInput"
                        style={styles.marginTopStyle(20)}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        onChangeText={(text) => {
                            setUserId(text);
                            userIdRef.current?.setError({});
                        }}
                        onBlur={() => {
                            validateRequiredInput(userId.trim(), userIdRef, userIdEmptyMsg);
                        }}
                    />
                    <StatefulTextInput
                        textContentType={isIos() ? "password" : "none"}
                        ref={passwordRef}
                        value={password}
                        password
                        label={t("common.password")}
                        hint={t("common.pleaseEnter")}
                        note={t("common.forgotPassword")}
                        testID="passwordInput"
                        style={styles.marginTopStyle(20)}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        onClickNote={() => {
                            if (isIos()) {
                                userIdRef.current?.clearText();
                                passwordRef.current?.clearText();
                                setTimeout(() => {
                                    NavigationService.navigate(Routers.forgotPasswordEnterEmail);
                                }, 100);
                            } else {
                                NavigationService.navigate(Routers.forgotPasswordEnterEmail);
                            }
                        }}
                        onChangeText={(text) => {
                            setPassword(text);
                            passwordRef.current?.setError({});
                        }}
                        onBlur={() => {
                            validateRequiredInput(password, passwordRef, passwordEmptyMsg);
                        }}
                    />
                    <PrimaryBtn style={styles.marginTopStyle(30)} label={sighInLabel} onPress={clickSignIn} />
                    <BiometricLoginBtn
                        onAuthSuccess={(authInfo) => {
                            console.log("onAuthSuccess", authInfo);
                            const { userID, password: pwd } = authInfo;
                            doSignIn(userID, pwd);
                        }}
                    />
                    <Text testID={genTestId("signUpText")} style={styles.signUpStr}>
                        {t("signIn.noAccount")}
                    </Text>
                    <Text
                        testID={genTestId("signUpLink")}
                        style={styles.clickHereCreateOneBtn}
                        onPress={() => {
                            if (isIos()) {
                                userIdRef.current?.clearText();
                                passwordRef.current?.clearText();
                                setTimeout(() => {
                                    route?.navigation?.push(Routers.signUpNav);
                                }, 100);
                            } else {
                                route?.navigation?.push(Routers.signUpNav);
                            }
                        }}
                    >
                        {` ${t("signIn.clickHereCreateOne")}`}
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
}

export default SignInScreen;
