import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { genTestId } from "../../../helper/AppHelper";
import PopupDropdown from "../../../components/PopupDropdown";
import Page from "../../../components/Page";
import PrimaryBtn from "../../../components/PrimaryBtn";
import AppTheme from "../../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { saveProfile, findProfile, isProfileAlreadyAssociatedWithAccount } from "../../../services/ProfileService";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import AdultProfileInfo from "./AdultProfileInfo";
import YouthProfileInfo from "./YouthProfileInfo";
import BusinessProfileInfo from "./BusinessProfileInfo";
import VesselProfileInfo from "./VesselProfileInfo";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";
import { showSimpleDialog, updateLoginStep } from "../../../redux/AppSlice";
import LoginStep from "../../../constants/LoginStep";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    contentContainerStyle: {
        paddingTop: 0,
        flexGrow: 1,
    },
});

const AddProfileInfo = ({ mobileAccount, profile, setProfile, routeScreen, profileTypes }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const safeAreaInsets = useSafeAreaInsets();
    const { profileType } = profile;

    const [identificationOwnerChanged, setIdentificationOwnerChanged] = useState(true);

    const changeProfileType = (index) => {
        const selectedProfileType = profileTypes[index];
        setProfile({ ...profile, profileType: selectedProfileType });
        setIdentificationOwnerChanged(false);
        setTimeout(() => setIdentificationOwnerChanged(true), 0);
    };
    const adultProfileInfoRef = useRef();
    const youthProfileInfoRef = useRef();
    const businessProfileInfoRef = useRef();
    const vesselProfileInfoRef = useRef();

    const onSave = async () => {
        let errorReported = false;
        if (PROFILE_TYPE_IDS.adult === profileType.id) {
            errorReported = adultProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.youth === profileType.id) {
            errorReported = youthProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.business === profileType.id) {
            errorReported = businessProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.vessel === profileType.id) {
            errorReported = vesselProfileInfoRef.current.validate();
        }
        if (errorReported) return;
        const existingProfile = await findProfile(profile);
        if (!existingProfile) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.addedProfileIsInvalid",
                })
            );
        } else {
            const alreadyAssociatedWithAccount = await isProfileAlreadyAssociatedWithAccount(
                mobileAccount,
                existingProfile
            );
            if (alreadyAssociatedWithAccount) {
                dispatch(
                    showSimpleDialog({
                        title: "common.error",
                        message: "errMsg.profileAlreadyExists",
                    })
                );
                return;
            }
            if (existingProfile.isNeedCRSS) {
                NavigationService.navigate(Routers.crss, {
                    mobileAccount,
                    profile: { ...existingProfile, isPrimary: profile.isPrimary },
                    routeScreen,
                });
            } else {
                await saveProfile(mobileAccount, { ...existingProfile, isPrimary: profile.isPrimary });
                if (routeScreen) {
                    NavigationService.navigate(routeScreen);
                } else {
                    dispatch(updateLoginStep(LoginStep.onBoarding));
                }
            }
        }
    };

    return (
        <Page>
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    ...styles.contentContainerStyle,
                    paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
                }}
            >
                <View style={styles.page_container}>
                    <PopupDropdown
                        testID={genTestId("YouAreDropdown")}
                        label={t("profile.youAre")}
                        containerStyle={{ marginTop: 20 }}
                        valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                        labelStyle={{ color: AppTheme.colors.font_color_1 }}
                        options={profileTypes}
                        value={profileType?.name}
                        onSelect={(index) => changeProfileType(index)}
                    />
                    {PROFILE_TYPE_IDS.adult === profileType.id && (
                        <AdultProfileInfo ref={adultProfileInfoRef} profile={profile} setProfile={setProfile} />
                    )}
                    {PROFILE_TYPE_IDS.youth === profileType.id && (
                        <YouthProfileInfo
                            ref={youthProfileInfoRef}
                            profile={profile}
                            setProfile={setProfile}
                            identificationOwnerChanged={identificationOwnerChanged}
                        />
                    )}
                    {PROFILE_TYPE_IDS.business === profileType.id && (
                        <BusinessProfileInfo ref={businessProfileInfoRef} profile={profile} setProfile={setProfile} />
                    )}
                    {PROFILE_TYPE_IDS.vessel === profileType.id && (
                        <VesselProfileInfo ref={vesselProfileInfoRef} profile={profile} setProfile={setProfile} />
                    )}

                    <PrimaryBtn style={{ marginTop: 40 }} label={t("profile.addProfileProceed")} onPress={onSave} />
                </View>
            </KeyboardAwareScrollView>
        </Page>
    );
};

export default AddProfileInfo;
