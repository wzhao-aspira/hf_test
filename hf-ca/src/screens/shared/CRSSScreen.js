import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { isEmpty } from "lodash";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import AppTheme from "../../assets/_default/AppTheme";
import { SharedStyles } from "../../styles/CommonStyles";
import { DEFAULT_BTN_RADIUS } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import NavigationService from "../../navigation/NavigationService";
import { showSimpleDialog } from "../../redux/AppSlice";

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

    const dispatch = useDispatch();

    const passwordRef = React.createRef();
    const [password, setPassword] = useState();

    const emptyValidate = (input, msg = "required") => {
        return {
            error: isEmpty(input),
            errorMsg: msg,
        };
    };

    const onSubmit = () => {
        const error = emptyValidate(password, t("errMsg.emptyPassword"));
        if (error.error) {
            passwordRef?.current.setError(error);
        } else if (password == "888888") {
            const { params } = route;
            if (!isEmpty(params)) {
                const { routeScreen } = params;
                if (isEmpty(routeScreen)) {
                    NavigationService.back();
                } else {
                    NavigationService.navigate(routeScreen);
                }
            } else {
                NavigationService.back();
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
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("crss.enterYourPassword")} />
            <Page>
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
                            email@example.com
                        </Text>
                    </View>
                    <StatefulTextInput
                        testID={genTestId("PasswordInput")}
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
            </Page>
        </View>
    );
}
