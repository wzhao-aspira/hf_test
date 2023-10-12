/* eslint-disable no-param-reassign */
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useImmer } from "use-immer";
import { isEmpty } from "lodash";
import PopupDropdown from "../../../components/PopupDropdown";
import PrimaryBtn from "../../../components/PrimaryBtn";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import { handleError } from "../../../network/APIUtil";
import { findAndLinkPrimaryProfile, findAndLinkProfile } from "../../../services/ProfileService";
import ProfileThunk from "../../../redux/ProfileThunk";
import appThunkActions from "../../../redux/AppThunk";
import OnBoardingHelper from "../../../helper/OnBoardingHelper";
import LoginStep from "../../../constants/LoginStep";
import { updateLoginStep } from "../../../redux/AppSlice";

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
        return true;
    }
    return false;
};

export const refreshDataAndNavigateWhenSaveProfileCompleted = async (
    dispatch,
    mobileAccount,
    isAddPrimaryProfile,
    routeScreen
) => {
    // Refresh/initial Profiles - sign up
    if (isAddPrimaryProfile && isEmpty(routeScreen)) {
        await dispatch(appThunkActions.initUserData(mobileAccount));
        await dispatch(ProfileThunk.initProfile());
    } else {
        const response = await dispatch(ProfileThunk.refreshProfileList({ isForce: true }));
        if (!response.success || response.primaryIsInactivated) {
            return;
        }
    }
    // Navigate to page
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
};

function AddProfileInfo({ mobileAccount, profile: initProfile, routeScreen, profileTypes }) {
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const [profile, setProfile] = useImmer(initProfile);

    const changeProfileType = (index) => {
        const selectedProfileType = profileTypes[index];
        setProfile((draft) => {
            draft.profileType = { ...selectedProfileType };
        });
    };

    const onContinue = () => {
        const router =
            profile.profileType?.id === PROFILE_TYPE_IDS.individual
                ? Routers.addIndividualProfile
                : Routers.addBusinessVesselProfile;
        NavigationService.navigate(router, {
            mobileAccount,
            profile,
            routeScreen,
        });
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
                    testID="CustomerTypeDropdown"
                    label={t("profile.customerType")}
                    containerStyle={{ marginTop: 20 }}
                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    options={profileTypes}
                    value={profile.profileType?.name}
                    onSelect={(index) => changeProfileType(index)}
                />
                <PrimaryBtn style={{ marginTop: 40 }} label={t("common.continue")} onPress={onContinue} />
            </View>
        </KeyboardAwareScrollView>
    );
}

export default AddProfileInfo;
