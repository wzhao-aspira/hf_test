/* eslint-disable no-param-reassign */
import { isEmpty } from "lodash";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useImmer } from "use-immer";
import StatefulTextInput from "../../../components/StatefulTextInput";
import PopupDropdown from "../../../components/PopupDropdown";
import HfDatePicker from "../../../components/HfDatePicker";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { IDENTIFICATION_OWNER_YOUTH, DEFAULT_DATE_FORMAT, PROFILE_TYPE_IDS } from "../../../constants/Constants";
import { emptyError, emptyValidate } from "./ProfileValidate";

import CommonHeader from "../../../components/CommonHeader";
import PrimaryBtn from "../../../components/PrimaryBtn";
import { updateLoginStep } from "../../../redux/AppSlice";
import LoginStep from "../../../constants/LoginStep";
import OnBoardingHelper from "../../../helper/OnBoardingHelper";
import NavigationService from "../../../navigation/NavigationService";
import ProfileThunk from "../../../redux/ProfileThunk";
import { saveProfile } from "./AddProfileInfo";
import Page from "../../../components/Page";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";

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

function AddIndividualProfileInfoDetailsScreen({ route }) {
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const dateOfBirthRef = useRef();
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    const identificationTypeSelectorRef = useRef();
    const { params } = route;
    const {
        allIdentificationTypes,
        identificationTypes: initIdentificationTypes,
        identificationOwners,
        mobileAccount,
        profile: initProfile,
        isAddPrimaryProfile,
        routeScreen,
    } = params;
    const [profile, setProfile] = useImmer(initProfile);
    const [identificationTypes, setIdentificationTypes] = useState(initIdentificationTypes);

    const handleIdentificationType = (identificationType) => {
        setProfile((draft) => {
            draft.identificationType = identificationType;
        });
    };

    const setCurrentIdentificationTypesWhenOwnerChanged = (selectedIdentificationOwner) => {
        const selectedIdentificationTypes =
            selectedIdentificationOwner && IDENTIFICATION_OWNER_YOUTH === selectedIdentificationOwner.id
                ? allIdentificationTypes.adultOrYouth
                : allIdentificationTypes.parentOrGuardian;
        setIdentificationTypes(selectedIdentificationTypes);
        setProfile((draft) => {
            draft.identificationOwner = selectedIdentificationOwner;
            draft.identificationType = !isEmpty(selectedIdentificationTypes) ? selectedIdentificationTypes[0] : {};
        });
    };

    const changeIdentificationOwner = (index) => {
        const selectedIdentificationOwner = identificationOwners[index];
        setCurrentIdentificationTypesWhenOwnerChanged(selectedIdentificationOwner);
    };

    const validate = () => {
        let errorOfFirstName = { error: false };
        if (PROFILE_TYPE_IDS.youth === profile.profileType?.id) {
            errorOfFirstName = emptyValidate(profile.firstName, t("errMsg.emptyFirstName"));
            firstNameRef?.current.setError(errorOfFirstName);
        }
        const identificationTypeErrorReported = identificationTypeSelectorRef.current?.validate();
        return errorOfFirstName.error || identificationTypeErrorReported;
    };
    const onSave = async () => {
        const errorReported = validate();
        if (errorReported) return;

        const isSaveSuccess = await saveProfile(dispatch, mobileAccount, isAddPrimaryProfile, profile, routeScreen);
        if (!isSaveSuccess) {
            return;
        }
        if (routeScreen) {
            NavigationService.navigate(routeScreen);
            dispatch(ProfileThunk.refreshProfileList({ isForce: true }));
        } else {
            const { userID } = mobileAccount;
            const onBoardingScreens = await OnBoardingHelper.checkOnBoarding(userID);
            if (!isEmpty(onBoardingScreens)) {
                dispatch(updateLoginStep(LoginStep.onBoarding));
            } else {
                dispatch(updateLoginStep(LoginStep.home));
            }
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t(isAddPrimaryProfile ? "signUp.addPrimaryProfile" : "profile.addProfile")} />
            <Page>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        ...styles.contentContainerStyle,
                        paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
                    }}
                >
                    <View style={styles.page_container}>
                        <HfDatePicker
                            testID="DateOfBirth"
                            label={t("profile.dateOfBirth")}
                            ref={dateOfBirthRef}
                            hint={DEFAULT_DATE_FORMAT}
                            style={{ marginTop: 20 }}
                            labelStyle={{ color: AppTheme.colors.font_color_1 }}
                            onConfirm={(date) => {
                                const dateOfBirth = moment(date).format(DEFAULT_DATE_FORMAT);
                                setProfile({ ...profile, dateOfBirth });
                            }}
                            value={profile.dateOfBirth}
                            validate={(date) => {
                                return emptyValidate(date, t("errMsg.emptyDateOfBirth"));
                            }}
                            disabled
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
                            disabled
                        />
                        {PROFILE_TYPE_IDS.youth === profile.profileType?.id && (
                            <>
                                <StatefulTextInput
                                    testID="FirstName"
                                    label={t("profile.firstName")}
                                    ref={firstNameRef}
                                    hint={t("common.pleaseEnter")}
                                    style={{ marginTop: 20 }}
                                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                                    onChangeText={(firstName) => {
                                        setProfile({ ...profile, firstName });
                                        firstNameRef?.current.setError(emptyError);
                                    }}
                                    value={profile.firstName}
                                    onBlur={() => {
                                        const error = emptyValidate(profile.firstName, t("errMsg.emptyFirstName"));
                                        firstNameRef?.current.setError(error);
                                    }}
                                />
                                <PopupDropdown
                                    testID="IdentificationOwner"
                                    label={t("profile.identificationOwner")}
                                    containerStyle={{ marginTop: 20 }}
                                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                                    options={identificationOwners}
                                    value={profile?.identificationOwner?.name}
                                    onSelect={(index) => changeIdentificationOwner(index)}
                                />
                            </>
                        )}
                        {profile.identificationOwner && (
                            <IdentificationTypeSelector
                                ref={identificationTypeSelectorRef}
                                identificationTypes={identificationTypes}
                                identificationType={profile?.identificationType}
                                handleIdentificationType={handleIdentificationType}
                            />
                        )}
                        <PrimaryBtn style={{ marginTop: 40 }} label={t("profile.addProfileProceed")} onPress={onSave} />
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
}

export default AddIndividualProfileInfoDetailsScreen;
