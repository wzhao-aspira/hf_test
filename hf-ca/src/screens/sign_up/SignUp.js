import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTranslation, Trans } from "react-i18next";
import emailValidator from "email-validator";
import { useDispatch } from "react-redux";
import StatefulTextInput from "../../components/StatefulTextInput";
import CountdownTextInput from "../../components/CountdownTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "../profile/add_profile/ProfileValidate";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import AccountService from "../../services/AccountService";
import DialogHelper from "../../helper/DialogHelper";
import { handleError } from "../../network/APIUtil";
import { setLoginCredential } from "../../helper/LocalAuthHelper";
import { updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import { DEFAULT_RADIUS } from "../../constants/Dimension";
import { appConfig } from "../../services/AppConfigService";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    disclaimerCard: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        top: 120,
        marginBottom: 10,
        position: "absolute",
        zIndex: 1,
        width: "100%",
    },
    disclaimerText: {
        maxHeight: 400,
    },
    disclaimerTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
        marginVertical: 10,
    },
    disclaimerMessage: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_2,
        lineHeight: 20,
        marginVertical: 10,
    },
    disclaimerButton: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

function SignUp() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [mobileAccount, setMobileAccount] = useState();
    const [isEmailValidationCodeBeSended, setEmailValidationCodeBeSended] = useState(false);
    const [isShowCountdown, setIsShowCountdown] = useState(true);
    const [isShowAcknowledgement, setIsShowAcknowledgement] = useState(true);
    const userIDRef = useRef();
    const emailValidationCodeRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const isEmptyValidationCode = () => {
        const emptyValidationCode = emptyValidate(
            mobileAccount?.emailValidationCode,
            t("errMsg.emptyEmailValidationCode")
        );
        emailValidationCodeRef?.current.setError(emptyValidationCode);
        return emptyValidationCode.error;
    };

    const isEmptyUserID = () => {
        const emptyErrorOfUserID = emptyValidate(mobileAccount?.userID, t("errMsg.emptyUserID"));
        userIDRef?.current.setError(emptyErrorOfUserID);
        return emptyErrorOfUserID.error;
    };

    const validate = () => {
        const emptyUserIDError = isEmptyUserID();
        const emptyValidationCodeError = isEmptyValidationCode();
        const errorOfPassword = emptyValidate(mobileAccount?.password, t("errMsg.emptyPassword"));
        passwordRef?.current.setError(errorOfPassword);
        const errorOfConfirmPassword = emptyValidate(mobileAccount?.confirmPassword, t("errMsg.emptyConfirmPassword"));
        confirmPasswordRef?.current.setError(errorOfConfirmPassword);
        return emptyUserIDError || emptyValidationCodeError || errorOfPassword.error || errorOfConfirmPassword.error;
    };
    const onSendEmailVerifyCode = async () => {
        const emptyUserIDError = isEmptyUserID();
        if (emptyUserIDError) {
            return;
        }
        if (!emailValidator.validate(mobileAccount?.userID)) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "signIn.userIdInvalid",
                okText: "common.gotIt",
            });
            return;
        }
        const isSendSuccess = await handleError(AccountService.sendEmailValidationCode(mobileAccount?.userID), {
            dispatch,
            showLoading: true,
        });
        if (isSendSuccess.success) {
            setEmailValidationCodeBeSended(true);
            setIsShowCountdown(true);
        }
    };
    const onSave = async () => {
        const errorReported = validate();
        if (errorReported) return;
        const userID = mobileAccount?.userID.trim();
        if (!emailValidator.validate(userID)) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "signIn.userIdInvalid",
                okText: "common.gotIt",
            });
            return;
        }
        if (mobileAccount?.password !== mobileAccount?.confirmPassword) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "errMsg.passwordDotNotMatch",
                okText: "common.gotIt",
            });
            return;
        }
        const storedMobileAccount = await handleError(
            AccountService.createMobileAccount(userID, mobileAccount?.emailValidationCode, mobileAccount?.password),
            {
                dispatch,
                showLoading: true,
            }
        );
        if (!storedMobileAccount.success) {
            return;
        }
        if (!storedMobileAccount) return;
        const signInResult = await handleError(AccountService.authSignIn(userID, mobileAccount?.password), {
            dispatch,
            showLoading: true,
        });

        if (signInResult?.success) {
            setLoginCredential(userID, mobileAccount?.password);
            NavigationService.navigate(Routers.addIndividualProfile, { mobileAccount, isAddPrimaryProfile: true });
        }
    };

    return (
        <View>
            <StatefulTextInput
                testID="UserID"
                label={t("common.userID")}
                hint={t("common.pleaseEnterEmail")}
                ref={userIDRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(userID) => {
                    setMobileAccount({ ...mobileAccount, userID });
                    userIDRef.current.setError(emptyError);
                }}
                value={mobileAccount?.userID}
                onBlur={() => {
                    const error = emptyValidate(mobileAccount?.userID, t("errMsg.emptyUserID"));
                    userIDRef?.current.setError(error);
                }}
            />
            {isShowAcknowledgement && (
                <View style={styles.disclaimerCard}>
                    <ScrollView style={styles.disclaimerText}>
                        <Text testID={genTestId("disclaimer_title")} style={styles.disclaimerTitle}>
                            <Trans i18nKey="signUp.disclaimerTitle" />
                        </Text>
                        <Text testID={genTestId("disclaimer_text")} style={styles.disclaimerMessage}>
                            {appConfig.data.userAcknowledgement}
                        </Text>
                    </ScrollView>
                    <View style={styles.disclaimerButton}>
                        <OutlinedBtn
                            onPress={() => dispatch(updateLoginStep(LoginStep.login))}
                            label={t("common.cancel")}
                            testID={genTestId("AcknowledgeCancel")}
                        />
                        <PrimaryBtn
                            testID={genTestId("Acknowledge")}
                            label={t("signUp.acknowledge")}
                            onPress={() => setIsShowAcknowledgement(false)}
                        />
                    </View>
                </View>
            )}
            {!isEmailValidationCodeBeSended && (
                <PrimaryBtn
                    style={{ marginTop: 40 }}
                    label={t("common.sendValidationCode")}
                    onPress={onSendEmailVerifyCode}
                />
            )}
            {isEmailValidationCodeBeSended && (
                <>
                    <CountdownTextInput
                        testID="EmailValidationCode"
                        ref={emailValidationCodeRef}
                        value={mobileAccount?.emailValidationCode}
                        label={t("forgotPassword.enterValidationCode.emailValidationCode")}
                        hint={t("common.pleaseEnter")}
                        style={{ marginTop: 20 }}
                        labelStyle={{ color: AppTheme.colors.font_color_1 }}
                        inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                        onChangeText={(emailValidationCode) => {
                            setMobileAccount({ ...mobileAccount, emailValidationCode });
                            emailValidationCodeRef.current?.setError({});
                        }}
                        onBlur={() => {
                            isEmptyValidationCode();
                        }}
                        sendResend={t("forgotPassword.enterValidationCode.resendCode")}
                        onClickSendResend={async () => {
                            onSendEmailVerifyCode();
                        }}
                        isShowCountdown={isShowCountdown}
                        isShowResendCode
                        onCountdownFinish={() => {
                            setIsShowCountdown(false);
                        }}
                    />
                    <StatefulTextInput
                        testID="Password"
                        label={t("common.password")}
                        hint={t("common.pleaseEnter")}
                        password
                        ref={passwordRef}
                        style={{ marginTop: 20 }}
                        labelStyle={{ color: AppTheme.colors.font_color_1 }}
                        inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                        onChangeText={(password) => {
                            setMobileAccount({ ...mobileAccount, password });
                            passwordRef.current.setError(emptyError);
                        }}
                        value={mobileAccount?.password}
                        onBlur={() => {
                            const error = emptyValidate(mobileAccount?.password, t("errMsg.emptyPassword"));
                            passwordRef?.current.setError(error);
                        }}
                    />
                    <StatefulTextInput
                        testID="ConfirmPassword"
                        label={t("common.confirmPassword")}
                        hint={t("common.pleaseEnter")}
                        password
                        ref={confirmPasswordRef}
                        style={{ marginTop: 20 }}
                        labelStyle={{ color: AppTheme.colors.font_color_1 }}
                        inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                        onChangeText={(confirmPassword) => {
                            setMobileAccount({ ...mobileAccount, confirmPassword });
                            confirmPasswordRef.current.setError(emptyError);
                        }}
                        value={mobileAccount?.confirmPassword}
                        onBlur={() => {
                            const error = emptyValidate(
                                mobileAccount?.confirmPassword,
                                t("errMsg.emptyConfirmPassword")
                            );
                            confirmPasswordRef?.current.setError(error);
                        }}
                    />
                    <PrimaryBtn style={{ marginTop: 40 }} label={t("common.create")} onPress={onSave} />
                </>
            )}
        </View>
    );
}

export default SignUp;
