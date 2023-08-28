import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import emailValidator from "email-validator";
import { useDispatch } from "react-redux";
import StatefulTextInput from "../../components/StatefulTextInput";
import CountdownTextInput from "../../components/CountdownTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "../profile/add_profile/ProfileValidate";
import PrimaryBtn from "../../components/PrimaryBtn";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { checkAccountEmailIsExisting } from "../../services/ProfileService";
import AccountService from "../../services/AccountService";
import DialogHelper from "../../helper/DialogHelper";
import { SharedStyles } from "../../styles/CommonStyles";
import { handleError } from "../../network/APIUtil";

function SignUp() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [mobileAccount, setMobileAccount] = useState();
    const [isEmailValidationCodeBeSended, setEmailValidationCodeBeSended] = useState(false);
    const [isShowCountdown, setIsShowCountdown] = useState(true);

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
        const existing = await checkAccountEmailIsExisting(userID);
        if (existing) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "errMsg.foundExistingAccount",
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
            NavigationService.navigate(Routers.addPrimaryProfile, { mobileAccount });
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
                        style={{ marginTop: 30 }}
                        labelStyle={SharedStyles.page_content_title}
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
