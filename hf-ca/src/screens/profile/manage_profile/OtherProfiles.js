import { Pressable, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import ProfileItem from "./ProfileItem";
import { commonStyles } from "./Styles";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import { genTestId } from "../../../helper/AppHelper";
import ProfileItemLoading from "./ProfileItemLoading";
import ProfileThunk from "../../../redux/ProfileThunk";
import { handleError } from "../../../network/APIUtil";
import { getProfileTypes } from "../../../services/ProfileService";
import { selectUsername } from "../../../redux/AppSlice";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";

export default function OtherProfiles({ isLoading }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userName = useSelector(selectUsername);
    const otherProfilesWithoutPrimary = useSelector(profileSelectors.selectOtherProfileListWithoutPrimary);

    const handleAddProfile = async () => {
        const response = await dispatch(
            ProfileThunk.getProfileListChangeStatus({
                showGlobalLoading: true,
                showCIUChangedMsg: true,
                showListChangedMsg: true,
                networkErrorByDialog: true,
            })
        );

        if (!response.success || response.primaryIsInactivated || response.ciuIsInactivated || response.listChanged) {
            return;
        }

        dispatch(ProfileThunk.updateProfileData(response.profiles));
        const ret = await handleError(getProfileTypes(), { dispatch, showLoading: true });
        if (ret.success) {
            const profileTypes = ret.data;
            if (profileTypes?.length > 1) {
                NavigationService.navigate(Routers.addProfile, { profileTypes });
            } else {
                NavigationService.navigate(Routers.addIndividualProfile, {
                    mobileAccount: { userID: userName },
                    isAddPrimaryProfile: !!response.primaryIsInactivated,
                    routeScreen: Routers.manageProfile,
                });
            }
        }
    };

    return (
        <View>
            <Text style={commonStyles.subTitle}>{t("profile.otherProfiles")}</Text>
            {isLoading ? (
                <View style={{ marginTop: 16 }}>
                    <ProfileItemLoading />
                </View>
            ) : (
                <Pressable
                    style={{ marginTop: 16 }}
                    onPress={() => handleAddProfile()}
                    testID={genTestId("addProfile")}
                >
                    <View style={commonStyles.profileContainer}>
                        <View style={commonStyles.profileShortNameContainer}>
                            <FontAwesomeIcon icon={faPlus} size={24} color={AppTheme.colors.primary_2} />
                        </View>
                        <View>
                            <Text style={commonStyles.profileDisplayName}>{t("profile.addProfile")}</Text>
                        </View>
                        <View style={{ flexGrow: 1 }} />
                        <FontAwesomeIcon icon={faChevronRight} size={22} color={AppTheme.colors.primary_2} />
                    </View>
                </Pressable>
            )}
            {!isLoading &&
                otherProfilesWithoutPrimary.map((profile) => (
                    <ProfileItem
                        profileItemStyles={{
                            container: commonStyles.profileContainer,
                            pressable: { marginTop: 20 },
                        }}
                        showGoToDetailsPageButton
                        key={profile.profileId}
                        profile={profile}
                        onPress={() => {
                            NavigationService.navigate(Routers.profileDetails, {
                                profileId: profile.profileId,
                            });
                        }}
                    />
                ))}
        </View>
    );
}
