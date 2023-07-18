import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isEmpty } from "lodash";
import PopupDropdown from "../../../components/PopupDropdown";
import PrimaryBtn from "../../../components/PrimaryBtn";
import AppTheme from "../../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import {
    addProfile,
    addPrimaryProfile,
    findProfile,
    isProfileAlreadyAssociatedWithAccount,
    getIdentificationOwners,
} from "../../../services/ProfileService";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import AdultProfileInfo from "./AdultProfileInfo";
import YouthProfileInfo from "./YouthProfileInfo";
import BusinessProfileInfo from "./BusinessProfileInfo";
import VesselProfileInfo from "./VesselProfileInfo";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";
import { updateLoginStep } from "../../../redux/AppSlice";
import LoginStep from "../../../constants/LoginStep";
import OnBoardingHelper from "../../../helper/OnBoardingHelper";
import appThunkActions from "../../../redux/AppThunk";
import DialogHelper from "../../../helper/DialogHelper";

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

export const saveProfile = async (dispatch, isAddPrimaryProfile, mobileAccount, existingProfile) => {
    const userID = mobileAccount.userID.trim();
    if (isAddPrimaryProfile) {
        const isSaveSuccess = await addPrimaryProfile(mobileAccount, existingProfile.profileId);
        if (!isSaveSuccess) {
            DialogHelper.showSimpleDialog({
                title: "common.connectionError",
                message: "errMsg.unableEstablishService",
                okText: "common.gotIt",
            });
            return false;
        }
        dispatch(
            appThunkActions.initUserData({
                userID,
                primaryProfileId: existingProfile.profileId,
                otherProfileIds: [],
            })
        );
    } else {
        const isSaveSuccess = await addProfile(mobileAccount, existingProfile.profileId);
        if (!isSaveSuccess) {
            DialogHelper.showSimpleDialog({
                title: "common.connectionError",
                message: "errMsg.unableEstablishService",
                okText: "common.gotIt",
            });
            return false;
        }
        dispatch(
            appThunkActions.initUserData({
                userID,
                primaryProfileId: mobileAccount.primaryProfileId,
                otherProfileIds: [...mobileAccount.otherProfileIds, existingProfile.profileId],
            })
        );
    }
    return true;
};

const AddProfileInfo = ({
    mobileAccount,
    profile,
    setProfile,
    routeScreen,
    profileTypes,
    allIdentificationTypes,
    isAddPrimaryProfile,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const safeAreaInsets = useSafeAreaInsets();
    const { profileType } = profile;
    const identificationOwners = getIdentificationOwners();
    const [identificationTypes, setIdentificationTypes] = useState(allIdentificationTypes.adultOrYouth);
    const changeProfileType = (index) => {
        const selectedProfileType = profileTypes[index];
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
        setIdentificationTypes(defaultIdentificationTypes);
        setProfile({
            profileType: selectedProfileType,
            identificationOwner: defaultIdentificationOwner,
            identificationType: defaultIdentificationType,
        });
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
        const existingProfile = await findProfile(mobileAccount, profile);
        if (!existingProfile) {
            DialogHelper.showSimpleDialog({
                title: "common.error",
                message: "errMsg.addedProfileIsInvalid",
                okText: "common.gotIt",
            });
        } else {
            const alreadyAssociatedWithAccount = isProfileAlreadyAssociatedWithAccount(mobileAccount, existingProfile);
            if (alreadyAssociatedWithAccount) {
                DialogHelper.showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.profileAlreadyExists",
                    okText: "common.gotIt",
                });
                return;
            }
            if (existingProfile.isNeedCRSS) {
                NavigationService.navigate(Routers.crss, {
                    mobileAccount,
                    profile: { ...existingProfile },
                    routeScreen,
                    isAddPrimaryProfile,
                });
            } else {
                const isSaveSuccess = await saveProfile(dispatch, isAddPrimaryProfile, mobileAccount, existingProfile);
                if (!isSaveSuccess) {
                    return;
                }
                if (routeScreen) {
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
            }
        }
    };
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{
                ...styles.contentContainerStyle,
                paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
            }}
        >
            <View style={styles.page_container}>
                <PopupDropdown
                    testID="YouAreDropdown"
                    label={t("profile.youAre")}
                    containerStyle={{ marginTop: 20 }}
                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    options={profileTypes}
                    value={profileType?.name}
                    onSelect={(index) => changeProfileType(index)}
                />
                {PROFILE_TYPE_IDS.adult === profileType?.id && (
                    <AdultProfileInfo
                        ref={adultProfileInfoRef}
                        profile={profile}
                        setProfile={setProfile}
                        identificationTypes={identificationTypes}
                    />
                )}
                {PROFILE_TYPE_IDS.youth === profileType?.id && (
                    <YouthProfileInfo
                        ref={youthProfileInfoRef}
                        profile={profile}
                        setProfile={setProfile}
                        identificationOwners={identificationOwners}
                        allIdentificationTypes={allIdentificationTypes}
                        identificationTypes={identificationTypes}
                        setIdentificationTypes={setIdentificationTypes}
                    />
                )}
                {PROFILE_TYPE_IDS.business === profileType?.id && (
                    <BusinessProfileInfo ref={businessProfileInfoRef} profile={profile} setProfile={setProfile} />
                )}
                {PROFILE_TYPE_IDS.vessel === profileType?.id && (
                    <VesselProfileInfo ref={vesselProfileInfoRef} profile={profile} setProfile={setProfile} />
                )}

                <PrimaryBtn style={{ marginTop: 40 }} label={t("profile.addProfileProceed")} onPress={onSave} />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default AddProfileInfo;
