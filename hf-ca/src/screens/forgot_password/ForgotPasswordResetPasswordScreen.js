import { createRef, useReducer, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import StatefulTextInput from "../../components/StatefulTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { showSimpleDialog, updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import AccountService from "../../services/AccountService";
import { emptyValidate } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import PrimaryBtn from "../../components/PrimaryBtn";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { SimpleDialog } from "../../components/Dialog";

function dialogReducer(state, action) {
    if (action.type === "incorrectPassword") {
        return {
            message: "errMsg.incorrectExistingPassword",
            show: true,
        };
    }
    if (action.type === "sameAsOldPassword") {
        return {
            message: "errMsg.sameAsOldPassword",
            show: true,
        };
    }
    if (action.type === "closeDialog") {
        return {
            show: false,
        };
    }
    throw Error("Unknown action.");
}

export default function ForgotPasswordScreen({ route }) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { params } = route;
    const { emailAddress, isChangePassword } = params;
    const commonHeader = isChangePassword
        ? t("setting.changePassword")
        : t("forgotPassword.resetPassword.resetPassword");

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
            dispatch(
                showSimpleDialog({
                    title: "common.alert",
                    message: "errMsg.passwordDotNotMatch",
                    okText: "common.gotIt",
                })
            );
            return false;
        }
        return true;
    };

    const handleNavigation = () => {
        if (isChangePassword) {
            NavigationService.navigate(Routers.setting);
        } else {
            dispatch(updateLoginStep(LoginStep.login));
        }
    };

    const onReset = async () => {
        const isResetPasswordPassed = resetPasswordValidation();
        if (isResetPasswordPassed) {
            if (isChangePassword) {
                const result = await AccountService.verifyCurrentAccountPassword(currentPassword);
                if (result === "failed: password do not match") {
                    dialogDispatch({ type: "incorrectPassword" });
                    return;
                }

                if (currentPassword === newPassword) {
                    dialogDispatch({ type: "sameAsOldPassword" });
                    return;
                }
            }

            const isRestPasswordSucceed = await AccountService.updateMobileAccountPasswordByUserId(
                emailAddress,
                newPassword
            );
            if (isRestPasswordSucceed.success) {
                handleNavigation();
            }
        }
    };

    const renderResetPasswordSection = () => {
        return (
            <>
                <StatefulTextInput
                    testID="NewPassword"
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
                <CommonHeader title={commonHeader} />
                <KeyboardAwareScrollView>
                    <View style={ForgotPasswordStyles.page_container}>
                        {isChangePassword && currentPasswordSection()}
                        {renderResetPasswordSection()}
                        <PrimaryBtn
                            testID="ResetButton"
                            style={ForgotPasswordStyles.action_button}
                            label={t("forgotPassword.resetPassword.reset")}
                            onPress={onReset}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <SimpleDialog
                    okText="common.gotIt"
                    message={errorDialog.message}
                    visible={errorDialog.show}
                    okAction={() => dialogDispatch({ type: "closeDialog" })}
                />
            </View>
        </Page>
    );
}
