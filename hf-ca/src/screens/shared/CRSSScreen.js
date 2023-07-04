import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { isEmpty } from "lodash";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import AppTheme from "../../assets/_default/AppTheme";
import { SharedStyles } from "../../styles/CommonStyles";
import { DEFAULT_BTN_RADIUS } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import NavigationService from "../../navigation/NavigationService";
import { showSimpleDialog, updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import OnBoardingHelper from "../../helper/OnBoardingHelper";
import { saveProfile } from "../profile/add_profile/AddProfileInfo";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    attention_label: {
        ...SharedStyles.page_content_title,
        marginTop: 30,
        marginBottom: 15,
    },
    account_label: {
        ...SharedStyles.page_content_title,
        marginTop: 30,
        marginBottom: 10,
    },
    account_container: {
        alignSelf: "flex-start",
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.body_100,
    },
    account_content: {
        padding: 10,
    },
    submit_button: {
        marginTop: 20,
    },
});

export default function CRSSScreen({ route }) {
    const { t } = useTranslation();
    const { params } = route || {};
    const { mobileAccount, profile, routeScreen, isAddPrimaryProfile } = params || {};
    const dispatch = useDispatch();

    const passwordRef = React.createRef();
    const [password, setPassword] = useState();

    const emptyValidate = (input, msg = "required") => {
        return {
            error: isEmpty(input),
            errorMsg: msg,
        };
    };
    const onSubmit = async () => {
        const error = emptyValidate(password, t("errMsg.emptyPassword"));
        if (error.error) {
            passwordRef?.current.setError(error);
        } else if (password == profile?.crssPassword) {
            const isSaveSuccess = await saveProfile(dispatch, isAddPrimaryProfile, mobileAccount, profile);
            if (!isSaveSuccess) {
                return;
            }
            if (!isEmpty(routeScreen)) {
                NavigationService.navigate(routeScreen);
            } else {
                const { userID } = mobileAccount;
                const onBoardingScreens = await OnBoardingHelper.checkOnBoarding(userID);
                if (!isEmpty(onBoardingScreens)) {
                    dispatch(updateLoginStep(LoginStep.onBoarding));
                } else {
                    dispatch(updateLoginStep(LoginStep.home));
                }
            }
        } else {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.incorrectPassword",
                })
            );
        }
    };

    return (
        <Page>
            <CommonHeader title={t("crss.enterYourPassword")} />
            <KeyboardAwareScrollView>
                <View style={styles.page_container}>
                    <Text testID={genTestId("AttentionLabel")} style={styles.attention_label}>
                        <Trans i18nKey="common.attention" />
                    </Text>
                    <Text testID={genTestId("AttentionContent")} style={SharedStyles.page_content_text}>
                        <Trans i18nKey="crss.attentionContent" />
                    </Text>
                    <Text testID={genTestId("AccountLabel")} style={styles.account_label}>
                        <Trans i18nKey="common.account" />
                    </Text>
                    <View style={styles.account_container}>
                        <Text testID={genTestId("AccountContent")} style={styles.account_content}>
                            {profile?.crssEmail}
                        </Text>
                    </View>
                    <StatefulTextInput
                        testID="CRSSPassword"
                        ref={passwordRef}
                        style={{ marginTop: 30 }}
                        hint={t("common.pleaseEnter")}
                        label={t("common.password")}
                        labelStyle={SharedStyles.page_content_title}
                        inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                        onChangeText={(text) => {
                            setPassword(text);
                            const error = {
                                error: false,
                                errorMsg: null,
                            };
                            passwordRef?.current.setError(error);
                        }}
                        value={password}
                        password
                        note={t("common.forgotPassword")}
                        onClickNote={() => {
                            // Do nothing
                        }}
                        onBlur={() => {
                            const error = emptyValidate(password, t("errMsg.emptyPassword"));
                            passwordRef?.current.setError(error);
                        }}
                    />
                    <PrimaryBtn
                        testID={genTestId("SubmitButton")}
                        style={styles.submit_button}
                        label={t("common.submit")}
                        onPress={() => {
                            onSubmit();
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
        </Page>
    );
}
