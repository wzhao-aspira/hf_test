import { Pressable, ScrollView, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLinkSlash } from "@fortawesome/pro-regular-svg-icons";

import { selectors } from "../../../redux/ProfileSlice";
import { selectUsername } from "../../../redux/AppSlice";
import AppThunk from "../../../redux/AppThunk";
import { getMobileAccountByUserId, removeProfilesByUserId } from "../../../services/ProfileService";

import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import AppTheme from "../../../assets/_default/AppTheme";
import Routers from "../../../constants/Routers";

import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import { SelectDialog, SimpleDialog } from "../../../components/Dialog";
import SwitchProfileDialog from "../manage_profile/SwitchProfileDialog";
import NavigationService from "../../../navigation/NavigationService";

import { genTestId } from "../../../helper/AppHelper";
import {
    getAddressList,
    getInfoList,
    removeAction,
    removeProfileTypes,
    styles,
    switchAction,
} from "./ProfileDetailsUtils";
import getGOIDLabel from "../../../helper/ProfileHelper";
import { ProfileShortNameOrIcon } from "../manage_profile/ProfileItem";

function RenderItem({ item, divider }) {
    if (!item.value) {
        return null;
    }
    return (
        <View style={styles.infoItem} key={item.type}>
            <Text style={styles.infoType} testID={genTestId("itemLabel")}>
                {item.type}
            </Text>
            <Text style={styles.infoValue} testID={genTestId("itemValue")}>
                {item.value || "-"}
            </Text>

            {divider && <View style={styles.divider} />}
        </View>
    );
}

function ProfileHeader({ profile }) {
    const { t } = useTranslation();

    return (
        <View style={styles.headerContainer}>
            <ProfileShortNameOrIcon
                profile={profile}
                shortNameContainer={styles.profileShortNameContainer}
                profileShortNameStyles={styles.profileShortName}
                iconStyles={{ container: styles.profileTypeIconContainer, iconSize: 45 }}
            />

            <Text style={styles.profileDisplayName} testID={genTestId("profileDiaplyName")}>
                {profile.displayName}
            </Text>
            <Text style={styles.profileItemNumber} testID={genTestId("profileGoID")}>
                {getGOIDLabel(t, profile)} #: {profile.goIDNumber}
            </Text>
        </View>
    );
}

function ProfileDetailsScreen({ route }) {
    const { params } = route;
    const profileId = params?.profileId;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const primaryProfileId = useSelector(selectors.selectPrimaryProfileID);
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(profileId));
    const userID = useSelector(selectUsername);

    const [showSwitchProfile, setShowSwitchProfile] = useState(false);
    const [showSimpleDialog, setShowSimpleDialog] = useState(false);
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [removeProfileType, setRemoveProfileType] = useState({});

    const profilesInfo = getInfoList(profileDetails, t);
    const addressInfo = getAddressList(profileDetails, t);

    const { associatedProfiles = [] } = profileDetails;
    const associatedProfilesID = associatedProfiles.map((item) => item.profileId);
    const associatedProfilesName = associatedProfiles.map((item) => item.displayName).join(", ");

    const handleRemove = () => {
        removeProfilesByUserId(userID, [...associatedProfilesID, profileId]).then(async (response) => {
            if (response.success) {
                const userAccount = await getMobileAccountByUserId(userID);
                dispatch(AppThunk.initUserData(userAccount));
                NavigationService.navigate(Routers.manageProfile);
            }
        });
    };

    const handleOkAction = () => {
        if (removeProfileType.okAction === removeAction) {
            handleRemove();
        }
        if (removeProfileType.okAction === switchAction) {
            setShowSwitchProfile(true);
        }
        setShowSelectDialog(false);
    };

    const handleRemoveBtnClick = () => {
        if (profileId === primaryProfileId) {
            setShowSimpleDialog(true);
            return;
        }

        setShowSelectDialog(true);
        if (profileId === currentInUseProfileId) {
            setRemoveProfileType(removeProfileTypes.currentInUse);
            return;
        }

        if (associatedProfiles && associatedProfiles.length > 0) {
            const associatedProfileIsCurrentInUse = associatedProfiles.find(
                (item) => item.profileId === currentInUseProfileId
            );
            if (associatedProfileIsCurrentInUse) {
                setRemoveProfileType(removeProfileTypes.associatedProfileIsCurrentInUse);
                return;
            }
            setRemoveProfileType(removeProfileTypes.hasAssociatedProfile);
            return;
        }

        setRemoveProfileType(removeProfileTypes.normal);
    };

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("profile.profileDetails")} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <ProfileHeader profile={profileDetails} />

                <View style={{ padding: DEFAULT_MARGIN, paddingBottom: 0 }}>
                    <Text style={styles.address}>{t("profile.address")}</Text>
                    <View style={styles.infoBox}>
                        {addressInfo.map((item, index) => (
                            <RenderItem item={item} divider={index < addressInfo.length - 1} key={item.type} />
                        ))}
                    </View>

                    <Text style={[styles.address, { marginTop: 36 }]}>{t("profile.basicInformation")}</Text>
                    <View style={styles.infoBox}>
                        {profilesInfo.map((item, index) => (
                            <RenderItem item={item} divider={index < profilesInfo.length - 1} key={item.type} />
                        ))}
                    </View>

                    <Pressable
                        onPress={handleRemoveBtnClick}
                        style={styles.bottomBtnBox}
                        testID={genTestId("removeProfileButton")}
                    >
                        <FontAwesomeIcon icon={faLinkSlash} size={28} color={AppTheme.colors.error} />
                        <Text style={styles.removeProfile}>{t("profile.removeProfile")}</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <SimpleDialog
                visible={showSimpleDialog}
                title="profile.removeProfile"
                message="profile.removePrimaryProfileMsg"
                okText="common.gotIt"
                okAction={() => {
                    setShowSimpleDialog(false);
                }}
            />

            <SelectDialog
                visible={showSelectDialog}
                title="profile.removeProfile"
                message={removeProfileType.message}
                okText={removeProfileType.okText}
                okAction={handleOkAction}
                cancelAction={() => {
                    setShowSelectDialog(false);
                }}
            >
                {removeProfileType.showAssociatedProfileNames && (
                    <View style={styles.removeMsgContainer}>
                        <Text style={styles.removeMsg} testID={genTestId("associatedProfiles")}>
                            {t("profile.associatedProfiles")}
                        </Text>
                        <Text style={styles.removeMsg} testID={genTestId("associatedProfileNames")}>
                            {associatedProfilesName}
                        </Text>
                    </View>
                )}
            </SelectDialog>

            {showSwitchProfile && (
                <SwitchProfileDialog
                    hideDialog={() => {
                        setShowSwitchProfile(false);
                    }}
                />
            )}
        </Page>
    );
}

export default ProfileDetailsScreen;
