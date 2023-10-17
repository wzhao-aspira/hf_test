import { createRef, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import emailValidator from "email-validator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import StatefulTextInput from "../../components/StatefulTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import AccountService from "../../services/AccountService";
import { emptyValidate, headerTitleSubString } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import Attention from "../../components/Attention";
import PrimaryBtn from "../../components/PrimaryBtn";
import DialogHelper from "../../helper/DialogHelper";
import CountdownTextInput from "../../components/CountdownTextInput";
import { genTestId } from "../../helper/AppHelper";
import { handleError } from "../../network/APIUtil";
import { appConfig } from "../../services/AppConfigService";

export default function ForgotPasswordEnterEmailScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [emailAddress, setEmailAddress] = useState("");
    const [emailValidationCode, setEmailValidationCode] = useState();
    const [isShowCountdown, setIsShowCountdown] = useState(false);
    const emailAddressRef = createRef();
    const emailValidationCodeRef = createRef();

    const headerTitle = t("common.forgotPassword");

    const isEmptyEmailAddress = () => {
        const emptyEmailAddress = emptyValidate(emailAddress.trim(), t("signIn.userIdEmpty"));
        emailAddressRef?.current.setError(emptyEmailAddress);
        return emptyEmailAddress.error;
    };

    const isEmptyValidationCode = () => {
        const emptyValidationCode = emptyValidate(emailValidationCode, t("errMsg.emptyEmailValidationCode"));
        emailValidationCodeRef?.current.setError(emptyValidationCode);
        return emptyValidationCode.error;
    };

    const emailAddressValidation = () => {
        const isValidEmailAddress = emailValidator.validate(emailAddress.trim());
        if (!isValidEmailAddress) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "signIn.userIdInvalid",
                okText: "common.gotIt",
            });
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        const isEmptyEmail = isEmptyEmailAddress();
        const isEmptyCode = isEmptyValidationCode();
        if (isEmptyEmail || isEmptyCode) {
            return;
        }
        const isValidEmail = emailAddressValidation();
        if (!isValidEmail) {
            return;
        }

        const validationResponse = await handleError(
            AccountService.forgotPasswordValidation(emailAddress, emailValidationCode),
            { dispatch, showLoading: true }
        );

        if (validationResponse.success) {
            NavigationService.navigate(Routers.forgotPasswordResetPassword, {
                emailAddress,
                validationCode: emailValidationCode,
            });
        }
    };

    const renderEmailAddressSection = () => {
        return (
            <StatefulTextInput
                testID="EmailAddress"
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
                    isEmptyEmailAddress();
                }}
            />
        );
    };

    const renderEmailValidationCodeSection = () => {
        return (
            <CountdownTextInput
                testID="EmailValidationCode"
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
                    isEmptyValidationCode();
                }}
                sendResend={
                    isShowCountdown
                        ? t("forgotPassword.enterValidationCode.resendCode")
                        : t("forgotPassword.enterValidationCode.sendCode")
                }
                onClickSendResend={async () => {
                    const isEmptyEmail = isEmptyEmailAddress();
                    if (isEmptyEmail) {
                        return;
                    }
                    const isValidEmail = emailAddressValidation();
                    if (!isValidEmail) {
                        return;
                    }
                    const sendCodeResponse = await handleError(AccountService.forgotPasswordSendCode(emailAddress), {
                        dispatch,
                        showLoading: true,
                    });
                    if (sendCodeResponse.success) {
                        setIsShowCountdown(true);
                    }
                }}
                isShowCountdown={isShowCountdown}
                onCountdownFinish={() => {
                    setIsShowCountdown(false);
                }}
            />
        );
    };

    const renderTipMessageSection = () => {
        return (
            <Text testID={genTestId("TipMessage")} style={ForgotPasswordStyles.tip_message}>
                {appConfig.data.userPagesFooter}
            </Text>
        );
    };

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader title={headerTitleSubString(headerTitle, 0, headerTitle.length - 1)} />
                <KeyboardAwareScrollView>
                    <View style={ForgotPasswordStyles.page_container}>
                        <Attention contentKey="forgotPassword.enterEmail.attentionContent" />
                        {renderEmailAddressSection()}
                        {renderEmailValidationCodeSection()}
                        <PrimaryBtn
                            testID="SubmitButton"
                            style={ForgotPasswordStyles.action_button}
                            label={t("common.submit")}
                            onPress={onSubmit}
                        />
                        {renderTipMessageSection()}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Page>
    );
}
