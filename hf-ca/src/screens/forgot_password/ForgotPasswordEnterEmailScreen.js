import React, { createRef, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import emailValidator from "email-validator";
import { useDispatch } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import StatefulTextInput from "../../components/StatefulTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { showSimpleDialog } from "../../redux/AppSlice";
import AccountService from "../../services/AccountService";
import { emptyValidate, headerTitleSubString, testIdPrefix } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import AttentionSection from "./AttentionSection";
import ActionButton from "./ActionButton";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";

export default function ForgotPasswordEnterEmailScreen() {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [emailAddress, setEmailAddress] = useState();
    const emailAddressRef = createRef();

    const headerTitle = t("common.forgotPassword");

    const emailAddressValidation = async () => {
        const error = emptyValidate(emailAddress, t("signIn.userIdEmpty"));
        if (error.error) {
            emailAddressRef?.current.setError(error);
            return false;
        }
        const isValidEmailAddress = emailValidator.validate(emailAddress);
        if (!isValidEmailAddress) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "signIn.userIdInvalid",
                    okText: "common.gotIt",
                })
            );
            return false;
        }
        const isEmailAddressExisted = await AccountService.isMobileAccountExisted(emailAddress);
        if (!isEmailAddressExisted) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.emailAddressNotFound",
                    okText: "common.gotIt",
                })
            );
            return false;
        }
        return true;
    };

    const onSend = async () => {
        const isValidEmailAddress = await emailAddressValidation();
        if (isValidEmailAddress) {
            NavigationService.navigate(Routers.forgotPasswordEnterValidationCode, { emailAddress });
        }
    };

    const renderEmailAddressSection = () => {
        return (
            <>
                <StatefulTextInput
                    testID={`${testIdPrefix}EmailAddress`}
                    ref={emailAddressRef}
                    value={emailAddress}
                    label={t("forgotPassword.enterEmail.emailAddress")}
                    hint={t("common.pleaseEnter")}
                    style={{ marginTop: 30 }}
                    labelStyle={SharedStyles.page_content_title}
                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    onChangeText={(text) => {
                        setEmailAddress(text);
                        emailAddressRef.current?.setError({});
                    }}
                    onBlur={() => {
                        const error = emptyValidate(emailAddress, t("signIn.userIdEmpty"));
                        emailAddressRef?.current.setError(error);
                    }}
                />
            </>
        );
    };

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader title={headerTitleSubString(headerTitle, 0, headerTitle.length - 1)} />
                <View style={ForgotPasswordStyles.page_container}>
                    <AttentionSection testID={testIdPrefix} contentKey="forgotPassword.enterEmail.attentionContent" />
                    {renderEmailAddressSection()}
                    <ActionButton testID={testIdPrefix} label={t("forgotPassword.enterEmail.send")} onAction={onSend} />
                </View>
            </View>
        </Page>
    );
}
