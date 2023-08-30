import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isEmpty } from "lodash";
import PopupDropdown from "../../../components/PopupDropdown";
import PrimaryBtn from "../../../components/PrimaryBtn";
import AppTheme from "../../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { findAndLinkProfile, findAndLinkPrimaryProfile } from "../../../services/ProfileService";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import AdultProfileInfo from "./AdultProfileInfo";
import YouthProfileInfo from "./YouthProfileInfo";
import BusinessProfileInfo from "./BusinessProfileInfo";
import VesselProfileInfo from "./VesselProfileInfo";
import NavigationService from "../../../navigation/NavigationService";
import { updateLoginStep } from "../../../redux/AppSlice";
import LoginStep from "../../../constants/LoginStep";
import OnBoardingHelper from "../../../helper/OnBoardingHelper";
import profileSelectors from "../../../redux/ProfileSelector";
import { handleError } from "../../../network/APIUtil";
import ProfileThunk from "../../../redux/ProfileThunk";
import Routers from "../../../constants/Routers";
import appThunkActions from "../../../redux/AppThunk";
import OutlinedBtn from "../../../components/OutlinedBtn";
import AccountService from "../../../services/AccountService";
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

export const saveProfile = async (dispatch, mobileAccount, isAddPrimaryProfile, profile, routeScreen) => {
    const ret = await handleError(
        isAddPrimaryProfile ? findAndLinkPrimaryProfile(profile) : findAndLinkProfile(profile),
        { dispatch, showLoading: true }
    );
    if (ret.success) {
        if (ret.data?.customer?.useCRSS) {
            NavigationService.navigate(Routers.crss, {
                mobileAccount,
                customer: ret.data.customer,
                profile,
                routeScreen,
                isAddPrimaryProfile,
            });
            return false;
        }
        if (isAddPrimaryProfile) {
            await dispatch(appThunkActions.initUserData(mobileAccount));
            await dispatch(ProfileThunk.initProfile());
        }
        return true;
    }
    return false;
};

function AddProfileInfo({
    mobileAccount,
    profile,
    setProfile,
    routeScreen,
    profileTypes,
    allIdentificationTypes,
    isAddPrimaryProfile,
    noBackBtn = false,
}) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const safeAreaInsets = useSafeAreaInsets();
    const { profileType } = profile;
    const identificationOwners = useSelector(profileSelectors.selectYouthIdentityOwners);
    const initIdentificationTypes = allIdentificationTypes.adultOrYouth;
    const [identificationTypes, setIdentificationTypes] = useState(initIdentificationTypes);
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
    const onSignOut = async () => {
        const response = await handleError(AccountService.signOut(), { dispatch, showLoading: true });
        if (response.success) {
            await AccountService.clearAppData(dispatch);
            dispatch(updateLoginStep(LoginStep.login));
        }
    };
    useEffect(() => {
        // Here logic to handle identification types initialization, we can't simple remove []'s parameters or add parameters.
        if (identificationTypes?.length > 1) {
            return;
        }
        setIdentificationTypes(initIdentificationTypes);
    }, [identificationTypes, initIdentificationTypes]);
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
                {noBackBtn && (
                    <OutlinedBtn
                        testID="signOutBtn"
                        style={{ marginTop: 20 }}
                        label={t("login.signOut")}
                        onPress={() => {
                            DialogHelper.showSelectDialog({
                                title: "login.signOut",
                                message: "login.signOutTipMessage",
                                okAction: () => {
                                    onSignOut();
                                },
                            });
                        }}
                    />
                )}
            </View>
        </KeyboardAwareScrollView>
    );
}

export default AddProfileInfo;
