import { createRef, useReducer, useState } from "react";
import { TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import StatefulTextInput from "../../components/StatefulTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { selectUsername, updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import AccountService from "../../services/AccountService";
import { emptyValidate } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import PrimaryBtn from "../../components/PrimaryBtn";
import { SimpleDialog } from "../../components/Dialog";
import { useDialog } from "../../components/dialog/index";
import { setPasswordChangeInd } from "../../helper/LocalAuthHelper";
import { handleError } from "../../network/APIUtil";
import { getSecondTextContentTypeForIOS, isIOSVersionEqual, isIos, showToast } from "../../helper/AppHelper";
import Attention from "../../components/Attention";
import NavigationService from "../../navigation/NavigationService";
import { CA_PASSWORD_RULES } from "../../constants/Constants";

function dialogReducer(state, action) {
    if (action.type === "closeDialog") {
        return {
            show: false,
        };
    }
    throw Error("Unknown action.");
}

export default function ForgotPasswordScreen({ route }) {
    const { t } = useTranslation();
    const { openSimpleDialog } = useDialog();
    const dispatch = useDispatch();

    const userName = useSelector(selectUsername);

    const { params } = route;
    const { emailAddress, isChangePassword, validationCode } = params;
    const commonHeader = isChangePassword
        ? t("setting.changePassword")
        : t("forgotPassword.resetPassword.resetPassword");
    const buttonText = isChangePassword ? t("setting.changePassword") : t("forgotPassword.resetPassword.reset");

    const [currentUserName, setCurrentUserName] = useState(isChangePassword ? userName : emailAddress);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [errorDialog, dialogDispatch] = useReducer(dialogReducer, { message: "", show: false });

    const currentPasswordRef = createRef();
    const newPasswordRef = createRef();
    const confirmPasswordRef = createRef();

    const resetPasswordValidation = () => {
        let error;
        if (isChangePassword) {
            error = emptyValidate(currentPassword, t("errMsg.emptyCurrentPassword"));
            if (error.error) {
                currentPasswordRef?.current.setError(error);
                return false;
            }
        }
        error = emptyValidate(newPassword, t("errMsg.emptyNewPassword"));
        if (error.error) {
            newPasswordRef?.current.setError(error);
            return false;
        }
        error = emptyValidate(confirmPassword, t("errMsg.emptyConfirmPassword"));
        if (error.error) {
            confirmPasswordRef?.current.setError(error);
            return false;
        }
        if (newPassword != confirmPassword) {
            openSimpleDialog({
                title: isChangePassword ? "common.error" : "common.alert",
                message: "errMsg.passwordDotNotMatch",
                okText: "common.gotIt",
            });
            return false;
        }
        return true;
    };

    const onReset = async () => {
        const isResetPasswordPassed = resetPasswordValidation();

        newPasswordRef.current?.setSecureEntry();
        confirmPasswordRef.current?.setSecureEntry();

        if (isResetPasswordPassed) {
            if (isChangePassword) {
                const changePasswordResponse = await handleError(
                    AccountService.changePassword({ currentPassword, newPassword }),
                    { dispatch, showLoading: true }
                );
                if (changePasswordResponse.success) {
                    await setPasswordChangeInd(emailAddress, true);

                    const signOutResponse = await handleError(AccountService.signOut(), {
                        dispatch,
                        showLoading: true,
                    });
                    console.log("signOutResponse:", signOutResponse);
                    if (signOutResponse.success) {
                        showToast(t("setting.passwordSetSuccessfully"));
                        await AccountService.clearAppData(dispatch);
                        dispatch(updateLoginStep(LoginStep.login));
                    }
                }
            } else {
                const resetPasswordParams = {
                    emailAddress,
                    validationCode,
                    password: newPassword,
                };
                const isRestPasswordSucceed = await handleError(
                    AccountService.forgotAndResetPassword(resetPasswordParams),
                    { dispatch, showLoading: true }
                );
                if (isRestPasswordSucceed.success) {
                    dispatch(updateLoginStep(LoginStep.login));
                }
            }
        }
    };

    const renderResetPasswordSection = () => {
        return (
            <>
                {
                    //fix autofill order issue
                    isIos() && (
                        <TextInput
                            textContentType={"username"}
                            keyboardType={"email-address"}
                            autoCorrect={false}
                            spellCheck={false}
                            value={currentUserName}
                            style={{
                                width: 1,
                                height: 1,
                                fontSize: 1,
                                backgroundColor: AppTheme.colors.transparent,
                                color: AppTheme.colors.transparent,
                            }}
                            onChangeText={(text) => {
                                if (isChangePassword && text != userName) {
                                    setCurrentUserName(userName);
                                } else if (text != emailAddress) {
                                    setCurrentUserName(emailAddress);
                                }
                            }}
                        />
                    )
                }
                <StatefulTextInput
                    testID="NewPassword"
                    textContentType={isIos() ? "newPassword" : "none"}
                    passwordRules={CA_PASSWORD_RULES}
                    ref={newPasswordRef}
                    style={{ marginTop: 30 }}
                    hint={t("common.pleaseEnter")}
                    label={t("forgotPassword.resetPassword.newPassword")}
                    labelStyle={SharedStyles.page_content_title}
                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    onChangeText={(text) => {
                        setNewPassword(text);
                        const error = {
                            error: false,
                            errorMsg: null,
                        };
                        newPasswordRef?.current.setError(error);
                    }}
                    value={newPassword}
                    password
                    onBlur={() => {
                        const error = emptyValidate(newPassword, t("errMsg.emptyNewPassword"));
                        newPasswordRef?.current.setError(error);
                    }}
                />
                <StatefulTextInput
                    testID="ConfirmPassword"
                    textContentType={isIos() ? getSecondTextContentTypeForIOS() : "none"}
                    ref={confirmPasswordRef}
                    style={{ marginTop: 30 }}
                    hint={t("common.pleaseEnter")}
                    label={t("common.confirmPassword")}
                    labelStyle={SharedStyles.page_content_title}
                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        const error = {
                            error: false,
                            errorMsg: null,
                        };
                        confirmPasswordRef?.current.setError(error);
                    }}
                    value={confirmPassword}
                    password
                    onBlur={() => {
                        const error = emptyValidate(confirmPassword, t("errMsg.emptyConfirmPassword"));
                        confirmPasswordRef?.current.setError(error);
                    }}
                />
            </>
        );
    };

    const currentPasswordSection = () => {
        return (
            <StatefulTextInput
                testID="CurrentPassword"
                textContentType={isIos() ? "password" : "none"}
                ref={currentPasswordRef}
                style={{ marginTop: 30 }}
                hint={t("common.pleaseEnter")}
                label={t("setting.currentPassword")}
                labelStyle={SharedStyles.page_content_title}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(text) => {
                    setCurrentPassword(text);
                    const error = {
                        error: false,
                        errorMsg: null,
                    };
                    currentPasswordRef?.current.setError(error);
                }}
                value={currentPassword}
                password
                onBlur={() => {
                    const error = emptyValidate(currentPassword, t("errMsg.emptyCurrentPassword"));
                    currentPasswordRef?.current.setError(error);
                }}
            />
        );
    };

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader
                    title={commonHeader}
                    onBackClick={() => {
                        newPasswordRef.current?.clearText();
                        confirmPasswordRef.current?.clearText();
                        setTimeout(() => {
                            NavigationService.back();
                        }, 100);
                    }}
                />
                <KeyboardAwareScrollView>
                    <View style={ForgotPasswordStyles.page_container}>
                        {isChangePassword && (
                            <>
                                <Attention contentKey="setting.changePasswordAttention" />
                                {currentPasswordSection()}
                            </>
                        )}
                        {renderResetPasswordSection()}
                        <PrimaryBtn
                            testID="ResetButton"
                            style={ForgotPasswordStyles.action_button}
                            label={buttonText}
                            onPress={onReset}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <SimpleDialog
                    title="common.error"
                    okText="common.gotIt"
                    message={errorDialog.message}
                    visible={errorDialog.show}
                    okAction={() => dialogDispatch({ type: "closeDialog" })}
                />
            </View>
        </Page>
    );
}
