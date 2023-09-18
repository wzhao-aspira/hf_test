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
import { updateLoginStep } from "../../redux/AppSlice";
import appThunkActions from "../../redux/AppThunk";
import LoginStep from "../../constants/LoginStep";
import { SimpleDialog } from "../../components/Dialog";
import { validateRequiredInput, styles } from "./SignInUtils";
import { genTestId, setActiveUserID } from "../../helper/AppHelper";
import OnBoardingHelper from "../../helper/OnBoardingHelper";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import AccountService from "../../services/AccountService";
import BiometricLoginBtn from "../../components/BiometricLoginBtn";
import { resetBiometricIDLoginBlock, setLoginCredential, setPasswordChangeInd } from "../../helper/LocalAuthHelper";
import DialogHelper from "../../helper/DialogHelper";
import { handleError } from "../../network/APIUtil";
import ProfileThunk from "../../redux/ProfileThunk";
import { clearProfileSummaryFromDB, removePreferencePointListFromDB } from "../../db";

function SignInScreen(route) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const sighInLabel = t("login.signIn");
    const userIdEmptyMsg = t("signIn.userIdEmpty");
    const passwordEmptyMsg = t("signIn.passwordEmpty");

    const userIdRef = createRef();
    const passwordRef = createRef();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const showNoPrimaryProfileDialog = (userID) => {
        DialogHelper.showSimpleDialog({
            title: "common.reminder",
            message: "profile.primaryChanged",
            okText: "common.gotIt",
            withModal: true,
            okAction: () => {
                NavigationService.navigate(Routers.addIndividualProfile, {
                    mobileAccount: { userID },
                    isAddPrimaryProfile: true,
                    noBackBtn: true,
                });
            },
        });
    };

    const doSignIn = async (uid = userId, pwd = password) => {
        await clearProfileSummaryFromDB();
        await removePreferencePointListFromDB();

        const response = await handleError(AccountService.authSignIn(uid, pwd), { dispatch, showLoading: true });
        if (!response.success) {
            return;
        }
        // set user in redux and don't set user in local storage.
        await dispatch(appThunkActions.initUserData({ userID: uid }, false));
        await setLoginCredential(uid, pwd);

        const profileResponse = await dispatch(ProfileThunk.initProfile());
        if (!profileResponse.success) {
            return;
        }
        if (!profileResponse.primaryProfileId) {
            showNoPrimaryProfileDialog(uid);
            return;
        }

        // sign in successfully, set userId to local storage
        setActiveUserID(uid);

        // Clean the password change indicator
        await setPasswordChangeInd(uid, false);
        resetBiometricIDLoginBlock(uid);
        const onBoardingScreens = await OnBoardingHelper.checkOnBoarding(uid);
        if (!isEmpty(onBoardingScreens)) {
            dispatch(updateLoginStep(LoginStep.onBoarding));
        } else {
            dispatch(updateLoginStep(LoginStep.home));
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
                            NavigationService.navigate(Routers.forgotPasswordEnterEmail);
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
                        <Text
                            testID={genTestId("signUpLink")}
                            style={styles.signUpBtn}
                            onPress={() => {
                                route?.navigation?.push(Routers.signUpNav);
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
}

export default SignInScreen;
