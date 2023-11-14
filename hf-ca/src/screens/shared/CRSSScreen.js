import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, BackHandler } from "react-native";
import { isEmpty } from "lodash";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as WebBrowser from "expo-web-browser";
import CommonHeader from "../../components/CommonHeader";
import AppTheme from "../../assets/_default/AppTheme";
import { SharedStyles } from "../../styles/CommonStyles";
import { DEFAULT_BTN_RADIUS } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";
import { appConfig } from "../../services/AppConfigService";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import { crssVerify, linkCRSSProfile, removeCustomerFromDB, removeProfile } from "../../services/ProfileService";
import Attention from "../../components/Attention";
import { handleError } from "../../network/APIUtil";
import DateUtils from "../../utils/DateUtils";
import AppContract from "../../assets/_default/AppContract";
import { refreshDataAndNavigateWhenSaveProfileCompleted } from "../profile/add_profile/AddProfileInfo";
import NavigationService from "../../navigation/NavigationService";
import { clearProfileListUpdateTime } from "../../helper/AutoRefreshHelper";
import Page from "../../components/Page";
import ProfileThunk from "../../redux/ProfileThunk";
import { actions as appActions } from "../../redux/AppSlice";
import OutlinedBtn from "../../components/OutlinedBtn";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
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
    const { mobileAccount, customer, profile, routeScreen, isAddPrimaryProfile, crssVerifyProfiles } = params || {};
    const dispatch = useDispatch();

    const [profileIndex, setProfileIndex] = useState(0);
    const isCRSSVerify = !(crssVerifyProfiles == null || crssVerifyProfiles.length == 0);
    const [profileInPage, setProfileInPage] = useState(isCRSSVerify ? crssVerifyProfiles[profileIndex] : profile);
    const passwordRef = React.createRef();
    const [password, setPassword] = useState(null);

    const notAllowRemoveProfileInOfflineMsg = t("profile.notAllowRemoveProfileInOfflineMsg");

    useEffect(() => {
        const backListener = BackHandler.addEventListener("hardwareBackPress", () => {
            if (isCRSSVerify) {
                return true;
            }
            return false;
        });
        return () => {
            backListener.remove();
        };
    }, [isCRSSVerify]);

    const emptyValidate = (input, msg = "required") => {
        return {
            error: isEmpty(input),
            errorMsg: msg,
        };
    };

    const prepareNext = () => {
        if (profileIndex < crssVerifyProfiles.length - 1) {
            setProfileIndex((state) => state + 1);
            setProfileInPage(crssVerifyProfiles[profileIndex + 1]);
            setPassword(null);
        } else {
            clearProfileListUpdateTime();
            NavigationService.back();
        }
    };

    const onSubmit = async () => {
        const error = emptyValidate(password, t("errMsg.emptyPassword"));
        if (error.error) {
            passwordRef?.current.setError(error);
        } else if (isCRSSVerify) {
            console.log("CRSSScreen - crssVerifyProfiles.length:", crssVerifyProfiles.length);
            console.log("CRSSScreen - profileIndex", profileIndex);
            const rst = await handleError(crssVerify(profileInPage.profileId, password), {
                dispatch,
                showLoading: true,
            });
            if (rst.success) {
                prepareNext();
            }
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

    const onUnlinkCustomerRecord = async () => {
        dispatch(appActions.toggleIndicator(true));
        const customerId = profileInPage.profileId;
        const rst = await dispatch(
            ProfileThunk.getLatestCustomerLists({ networkErrorMsg: notAllowRemoveProfileInOfflineMsg })
        );
        if (!rst.success) {
            dispatch(appActions.toggleIndicator(false));
            return;
        }
        const { customerList } = rst;
        console.log("CRSSScreen - customerList:", customerList);
        if (customerList != null && customerList.length > 0) {
            const customerExisting = customerList?.find((item) => item.profileId === customerId);
            if (customerExisting) {
                const response = await handleError(removeProfile({ customerId }), {
                    dispatch,
                    showLoading: false,
                    networkErrorMsg: notAllowRemoveProfileInOfflineMsg,
                });
                if (!response.success) {
                    dispatch(appActions.toggleIndicator(false));
                    return;
                }
            }
            await removeCustomerFromDB(customerId);
            dispatch(appActions.toggleIndicator(false));
            prepareNext();
        } else {
            dispatch(appActions.toggleIndicator(false));
        }
    };

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("crss.enterYourPassword")} showLeft={!isCRSSVerify} />
            <KeyboardAwareScrollView>
                <View style={styles.page_container}>
                    <Attention contentKey="crss.attentionContent" />
                    <Text testID={genTestId("LastNameLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.lastName" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("LastNameContent")} style={styles.field_content}>
                            {profileInPage.lastName}
                        </Text>
                    </View>
                    <Text testID={genTestId("DateOfBirthLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.dateOfBirth" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("DateOfBirthContent")} style={styles.field_content}>
                            {DateUtils.dateToFormat(
                                profileInPage.dateOfBirth,
                                AppContract.outputFormat.fmt_2,
                                isCRSSVerify ? AppContract.inputFormat.fmt_3 : AppContract.inputFormat.fmt_5
                            )}
                        </Text>
                    </View>
                    <Text testID={genTestId("GOIDLabel")} style={styles.field_label}>
                        <Trans i18nKey="profile.identificationTypeGOID" />
                    </Text>
                    <View style={styles.field_container}>
                        <Text testID={genTestId("GOIDContent")} style={styles.field_content}>
                            {isCRSSVerify ? profileInPage.goIDNumber : customer.goid}
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
                    {isCRSSVerify && (
                        <OutlinedBtn
                            testID="UnlinkCustomerRecordButton"
                            style={styles.submit_button}
                            label={t("crss.unlinkCustomerRecord")}
                            onPress={() => {
                                onUnlinkCustomerRecord();
                            }}
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>
        </Page>
    );
}
