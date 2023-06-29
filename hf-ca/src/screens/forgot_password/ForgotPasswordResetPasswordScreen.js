import React, { createRef, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
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
import ActionButton from "./ActionButton";

export default function ForgotPasswordScreen({ route }) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { params } = route;
    const { emailAddress } = params;

    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const newPasswordRef = createRef();
    const confirmPasswordRef = createRef();

    const testIDStr = "ForgotPasswordResetPassword";

    const resetPasswordValidation = () => {
        let error = emptyValidate(newPassword, t("errMsg.emptyNewPassword"));
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

    const onReset = async () => {
        const isResetPasswordPassed = resetPasswordValidation();
        if (isResetPasswordPassed) {
            const isRestPasswordSucceed = await AccountService.updateMobileAccountPasswordByUserId(
                emailAddress,
                newPassword
            );
            if (isRestPasswordSucceed.success) {
                dispatch(updateLoginStep(LoginStep.login));
            }
        }
    };

    const renderResetPasswordSection = () => {
        return (
            <>
                <StatefulTextInput
                    testID={`${testIDStr}NewPassword`}
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
                    testID={`${testIDStr}ConfirmPassword`}
                    ref={confirmPasswordRef}
                    style={{ marginTop: 30 }}
                    hint={t("common.pleaseEnter")}
                    label={t("forgotPassword.resetPassword.confirmPassword")}
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

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader title={`${t("forgotPassword.resetPassword.reset")} ${t("common.password")}`} />

                <View style={ForgotPasswordStyles.page_container}>
                    {renderResetPasswordSection()}
                    <ActionButton
                        testID="ForgotPasswordResetPassword"
                        label={t("forgotPassword.resetPassword.reset")}
                        onAction={onReset}
                    />
                </View>
            </View>
        </Page>
    );
}
