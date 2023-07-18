import { createRef, useState } from "react";
import { View, Text } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { SharedStyles } from "../../styles/CommonStyles";
import { genTestId } from "../../helper/AppHelper";
import AppTheme from "../../assets/_default/AppTheme";
import CountdownTextInput from "../../components/CountdownTextInput";
import { emptyValidate, headerTitleSubString } from "./ForgotPasswordScreenUtils";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import PrimaryBtn from "../../components/PrimaryBtn";
import Attention from "../../components/Attention";
import DialogHelper from "../../helper/DialogHelper";

export default function ForgotPasswordEnterValidationCodeScreen({ route }) {
    const { t } = useTranslation();

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
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "errMsg.invalidEmailValidationCode",
                okText: "common.gotIt",
            });
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
                <Text testID={genTestId("TipMessage")} style={ForgotPasswordStyles.tip_message}>
                    <Trans i18nKey="forgotPassword.enterValidationCode.tipMessage" />
                </Text>
            </>
        );
    };

    return (
        <Page>
            <View style={{ flex: 1 }}>
                <CommonHeader title={headerTitleSubString(headerTitle, 0, headerTitle.length - 1)} />
                <KeyboardAwareScrollView>
                    <View style={ForgotPasswordStyles.page_container}>
                        <Attention contentKey="forgotPassword.enterValidationCode.attentionContent" />
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
