import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatefulTextInput from "../../../components/StatefulTextInput";
import AppTheme from "../../../assets/_default/AppTheme";
import {
    DATE_OF_BIRTH_DISPLAY_FORMAT,
    DEFAULT_DATE_FORMAT,
    PROFILE_TYPE_IDS,
    PROFILE_TYPES,
} from "../../../constants/Constants";
import { emptyError, emptyValidate, validateDateOfBirth } from "./ProfileValidate";
import PrimaryBtn from "../../../components/PrimaryBtn";
import CommonHeader from "../../../components/CommonHeader";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import OutlinedBtn from "../../../components/OutlinedBtn";
import { useDialog } from "../../../components/dialog/index";
import { handleError } from "../../../network/APIUtil";
import AccountService from "../../../services/AccountService";
import LoginStep from "../../../constants/LoginStep";
import { updateLoginStep } from "../../../redux/AppSlice";
import ProfileThunk from "../../../redux/ProfileThunk";
import { getIndividualProfileTypes } from "../../../services/ProfileService";
import Page from "../../../components/Page";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import profileSelectors from "../../../redux/ProfileSelector";
import { appConfig } from "../../../services/AppConfigService";
import DateOfBirthInput from "../../../components/DateOfBirthInput";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: DEFAULT_MARGIN,
        flex: 1,
    },
    contentContainerStyle: {
        paddingTop: 0,
        flexGrow: 1,
    },
});

function AddIndividualProfileInfoScreen({ route }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const { params } = route;
    const { mobileAccount, isAddPrimaryProfile, routeScreen, noBackBtn = false } = params;
    const individualProfileTypes = getIndividualProfileTypes();
    const identificationOwners = useSelector(profileSelectors.selectYouthIdentityOwners);
    const selectOne = { id: -1, name: t("profile.selectOne") };
    const allIdentificationTypes = useSelector(profileSelectors.selectIdentityTypes(selectOne));
    const { openSelectDialog } = useDialog();
    const [profile, setProfile] = useState({
        isPrimary: isAddPrimaryProfile,
        profileType: individualProfileTypes[0],
    });

    const lastNameRef = useRef();

    const getProfileDataBasedOnProfileType = (selectedProfileType) => {
        let defaultIdentificationOwner = {};
        let defaultIdentificationTypes = [];
        let defaultIdentificationType = {};
        if (PROFILE_TYPE_IDS.adult === selectedProfileType.id) {
            defaultIdentificationTypes = allIdentificationTypes.adultOrYouth;
            defaultIdentificationType = { ...allIdentificationTypes.adultOrYouth[0] };
        } else if (PROFILE_TYPE_IDS.youth === selectedProfileType.id) {
            defaultIdentificationOwner = { ...identificationOwners[0] };
            defaultIdentificationTypes = allIdentificationTypes.adultOrYouth;
            defaultIdentificationType = { ...allIdentificationTypes.adultOrYouth[0] };
        }
        const newProfile = {
            ...profile,
            profileType: { ...selectedProfileType },
            identificationOwner: defaultIdentificationOwner,
            identificationType: defaultIdentificationType,
        };
        return { newProfile, defaultIdentificationTypes };
    };

    const [dateOfBirthMsg, setDateOfBirthMsg] = useState("");
    const onContinue = () => {
        const dateOfBirthValidateErrorMsg = validateDateOfBirth(profile.dateOfBirth, DATE_OF_BIRTH_DISPLAY_FORMAT, t);
        setDateOfBirthMsg(dateOfBirthValidateErrorMsg);
        const errorOfLastName = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
        lastNameRef?.current.setError(errorOfLastName);
        const errorReported = dateOfBirthValidateErrorMsg || errorOfLastName.error;
        if (errorReported) {
            return;
        }
        // const moment = require('moment-timezone');
        const youthThreshold = appConfig.data.adultAge;
        // const timeZone = 'America/Los_Angeles';
        // const currentDate = moment.tz(timeZone);
        const currentDate = moment();
        const birthDate = moment(profile.dateOfBirth, DEFAULT_DATE_FORMAT);
        const age = currentDate.diff(birthDate, "years");
        const profileTypeId = age >= youthThreshold ? PROFILE_TYPE_IDS.adult : PROFILE_TYPE_IDS.youth;
        const profileType = PROFILE_TYPES.find((p) => profileTypeId === p.id);
        const { newProfile, defaultIdentificationTypes } = getProfileDataBasedOnProfileType(profileType);
        NavigationService.navigate(Routers.addIndividualProfileDetails, {
            allIdentificationTypes,
            identificationTypes: defaultIdentificationTypes,
            identificationOwners,
            mobileAccount,
            profile: newProfile,
            routeScreen,
            isAddPrimaryProfile,
        });
    };
    const onSignOut = async () => {
        const response = await handleError(AccountService.signOut(), { dispatch, showLoading: true });
        if (response.success) {
            await AccountService.clearAppData(dispatch);
            dispatch(updateLoginStep(LoginStep.login));
        }
    };
    useEffect(() => {
        dispatch(ProfileThunk.initProfileCommonData());
    }, [dispatch]);
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader
                title={t(isAddPrimaryProfile ? "signUp.addPrimaryProfile" : "profile.addProfile")}
                showLeft={!noBackBtn}
            />
            <Page>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        ...styles.contentContainerStyle,
                        paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
                    }}
                >
                    <View style={styles.page_container}>
                        <DateOfBirthInput
                            testID="DateOfBirth"
                            label={t("profile.dateOfBirth")}
                            style={{ marginTop: 20 }}
                            labelStyle={{ color: AppTheme.colors.font_color_1 }}
                            onValidate={(dateOfBirth) => {
                                const dateOfBirthValidateErrorMsg = validateDateOfBirth(
                                    dateOfBirth,
                                    DATE_OF_BIRTH_DISPLAY_FORMAT,
                                    t
                                );
                                setDateOfBirthMsg(dateOfBirthValidateErrorMsg);
                            }}
                            value={profile.dateOfBirth}
                            setValue={(dateOfBirth) => setProfile({ ...profile, dateOfBirth })}
                            errorMsg={dateOfBirthMsg}
                            setErrorMsg={() => setDateOfBirthMsg()}
                        />
                        <StatefulTextInput
                            testID="LastName"
                            label={t("profile.lastName")}
                            hint={t("common.pleaseEnter")}
                            ref={lastNameRef}
                            style={{ marginTop: 20 }}
                            labelStyle={{ color: AppTheme.colors.font_color_1 }}
                            inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                            onChangeText={(lastName) => {
                                setProfile({ ...profile, lastName });
                                lastNameRef?.current.setError(emptyError);
                            }}
                            value={profile.lastName}
                            onBlur={() => {
                                const error = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
                                lastNameRef?.current.setError(error);
                            }}
                        />
                        <PrimaryBtn style={{ marginTop: 40 }} label={t("common.continue")} onPress={onContinue} />
                        {noBackBtn && (
                            <OutlinedBtn
                                testID="signOutBtn"
                                style={{ marginTop: 20 }}
                                label={t("login.signOut")}
                                onPress={() => {
                                    openSelectDialog({
                                        title: "login.signOut",
                                        message: "login.signOutTipMessage",
                                        onConfirm: () => {
                                            onSignOut();
                                        },
                                    });
                                }}
                            />
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
}

export default AddIndividualProfileInfoScreen;
