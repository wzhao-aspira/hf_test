import React, { createRef, useState } from "react";
import { View, Text } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import { genTestId } from "../../helper/AppHelper";
import AppTheme from "../../assets/_default/AppTheme";
import CountdownTextInput from "../../components/CountdownTextInput";
import { showSimpleDialog } from "../../redux/AppSlice";
import { emptyValidate, headerTitleSubString, testIdPrefix } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import AttentionSection from "./AttentionSection";
import ActionButton from "./ActionButton";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";

export default function ForgotPasswordEnterValidationCodeScreen({ route }) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { params } = route;
    const { emailAddress } = params;

    const [emailValidationCode, setEmailValidationCode] = useState();
    const [isShowCountdown, setIsShowCountdown] = useState(true);

    const emailValidationCodeRef = createRef();

    const headerTitle = t("common.forgotPassword");

    const emailValidationCodeValidation = () => {
        const error = emptyValidate(emailValidationCode, t("errMsg.emptyEmailValidationCode"));
        if (error.error) {
            emailValidationCodeRef?.current.setError(error);
            return false;
        }
        if (emailValidationCode != "0000") {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.invalidEmailValidationCode",
                    okText: "common.gotIt",
                })
            );
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        const isValidEmailValidationCode = emailValidationCodeValidation();
        if (isValidEmailValidationCode) {
            NavigationService.navigate(Routers.forgotPasswordResetPassword, { emailAddress });
        }
    };

    const renderEmailValidationCodeSection = () => {
        return (
            <>
                <CountdownTextInput
                    testID={`${testIdPrefix}EmailValidationCode`}
                    ref={emailValidationCodeRef}
                    value={emailValidationCode}
                    label={t("forgotPassword.enterValidationCode.emailValidationCode")}
                    hint={t("common.pleaseEnter")}
                    style={{ marginTop: 30 }}
                    labelStyle={SharedStyles.page_content_title}
                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    onChangeText={(text) => {
                        setEmailValidationCode(text);
                        emailValidationCodeRef.current?.setError({});
                    }}
                    onBlur={() => {
                        const error = emptyValidate(emailValidationCode, t("errMsg.emptyEmailValidationCode"));
                        emailValidationCodeRef?.current.setError(error);
                    }}
                    note={t("forgotPassword.enterValidationCode.resend")}
                    onClickNote={() => {
                        setIsShowCountdown(true);
                    }}
                    isShowCountdown={isShowCountdown}
                    onCountdownFinish={() => {
                        setIsShowCountdown(false);
                    }}
                />
            </>
        );
    };

    const renderTipMessageSection = () => {
        return (
            <>
                <Text testID={genTestId(`${testIdPrefix}TipMessage`)} style={ForgotPasswordStyles.tip_message}>
                    <Trans i18nKey="forgotPassword.enterValidationCode.tipMessage" />
                </Text>
            </>
        );
    };

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader title={headerTitleSubString(headerTitle, 0, headerTitle.length - 1)} />
                <View style={ForgotPasswordStyles.page_container}>
                    <AttentionSection
                        testID={testIdPrefix}
                        contentKey="forgotPassword.enterValidationCode.attentionContent"
                    />
                    {renderEmailValidationCodeSection()}
                    <ActionButton testID={testIdPrefix} label={t("common.submit")} onAction={onSubmit} />
                    {renderTipMessageSection()}
                </View>
            </View>
        </Page>
    );
}
