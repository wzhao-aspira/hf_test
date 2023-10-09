import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { isEmpty } from "lodash";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as WebBrowser from "expo-web-browser";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import AppTheme from "../../assets/_default/AppTheme";
import { SharedStyles } from "../../styles/CommonStyles";
import { DEFAULT_BTN_RADIUS } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";
import { appConfig } from "../../services/AppConfigService";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import { linkCRSSProfile } from "../../services/ProfileService";
import Attention from "../../components/Attention";
import { handleError } from "../../network/APIUtil";
import DateUtils from "../../utils/DateUtils";
import AppContract from "../../assets/_default/AppContract";
import { refreshDataAndNavigateWhenSaveProfileCompleted } from "../profile/add_profile/AddProfileInfo";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    field_label: {
        ...SharedStyles.page_content_title,
        marginTop: 30,
        marginBottom: 10,
    },
    field_container: {
        alignSelf: "flex-start",
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.body_100,
    },
    field_content: {
        padding: 10,
    },
    submit_button: {
        marginTop: 20,
    },
});

export default function CRSSScreen({ route }) {
    const { t } = useTranslation();
    const { params } = route || {};
    const { mobileAccount, customer, profile, routeScreen, isAddPrimaryProfile } = params || {};
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
        } else {
            const ret = await handleError(linkCRSSProfile(customer.customerId, password, isAddPrimaryProfile), {
                dispatch,
                showLoading: true,
            });
            if (ret.success) {
                await refreshDataAndNavigateWhenSaveProfileCompleted(
                    dispatch,
                    mobileAccount,
                    isAddPrimaryProfile,
                    routeScreen
                );
            }
        }
    };

    return (
        <Page>
            <CommonHeader title={t("crss.enterYourPassword")} />
            <KeyboardAwareScrollView>
                <View style={styles.page_container}>
                    <Attention contentKey="crss.attentionContent" />
                    <Text testID={genTestId("LastNameLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.lastName" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("LastNameContent")} style={styles.field_content}>
                            {profile.lastName}
                        </Text>
                    </View>
                    <Text testID={genTestId("DateOfBirthLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.dateOfBirth" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("DateOfBirthContent")} style={styles.field_content}>
                            {DateUtils.dateToFormat(
                                profile.dateOfBirth,
                                AppContract.outputFormat.fmt_2,
                                AppContract.inputFormat.fmt_5
                            )}
                        </Text>
                    </View>
                    <Text testID={genTestId("GOIDLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.identificationTypeGOID" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("GOIDContent")} style={styles.field_content}>
                            {customer.goid}
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
                            WebBrowser.openBrowserAsync(
                                `${appConfig.data.internetSalesBaseURL}CustomerSearch/Begin`
                            ).catch((error) => {
                                // handle error
                                console.log(error);
                            });
                        }}
                        onBlur={() => {
                            const error = emptyValidate(password, t("errMsg.emptyPassword"));
                            passwordRef?.current.setError(error);
                        }}
                    />
                    <PrimaryBtn
                        testID="SubmitButton"
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
