import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLinkSlash } from "@fortawesome/pro-regular-svg-icons/faLinkSlash";

import { RefreshControl } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { selectors } from "../../../redux/ProfileSlice";
import { removeProfile, getGOIDLabel } from "../../../services/ProfileService";

import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import AppTheme from "../../../assets/_default/AppTheme";
import Routers from "../../../constants/Routers";

import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import NavigationService from "../../../navigation/NavigationService";

import { genTestId } from "../../../helper/AppHelper";
import { getAddressList, getInfoList, styles } from "./ProfileDetailsUtils";
import { ProfileShortNameOrIcon } from "../manage_profile/ProfileItem";
import { handleError } from "../../../network/APIUtil";
import DialogHelper from "../../../helper/DialogHelper";
import ProfileThunk from "../../../redux/ProfileThunk";

import useFocus from "../../../hooks/useFocus";
import ProfileDetailsLoading from "./ProfileDetailsLoading";
import { appConfig } from "../../../services/AppConfigService";
import RenderHTML from "../../../components/RenderHTML";

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

            <Text style={styles.profileDisplayName} testID={genTestId("profileDisplayName")}>
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

    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [noCacheData, setNoCacheData] = useState(false);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(profileId));
    const isPrimaryOrCiu = useSelector(selectors.selectIsPrimaryOrCiuProfile(profileId));

    const profilesInfo = getInfoList(profileDetails, t);
    const addressInfo = getAddressList(profileDetails, t);

    const { customerRecordAttention } = appConfig.data;

    const notAllowRemoveProfileInOfflineMsg = t("profile.notAllowRemoveProfileInOfflineMsg");

    const removeCallback = async () => {
        NavigationService.navigate(Routers.manageProfile);
        const listResponse = await dispatch(ProfileThunk.refreshProfileList({ isForce: true }));
        if (listResponse.primaryIsInactivated || listResponse.ciuIsInactivated || listResponse.needCRSSVerify) {
            return;
        }
        DialogHelper.showSimpleDialog({
            title: "common.reminder",
            message: "profile.profileListUpdated",
            okText: "common.gotIt",
        });
    };

    const handleRemove = async (profiles) => {
        const profile = profiles?.find((item) => item.customerId === profileId);
        let response = { success: true };

        if (profile) {
            response = await handleError(removeProfile({ customerId: profileId }), {
                dispatch,
                showLoading: true,
                networkErrorMsg: notAllowRemoveProfileInOfflineMsg,
            });
        }

        if (response.success) {
            removeCallback();
        }
    };

    const handleRemoveBtnClick = async () => {
        console.log("ProfileDetailScreen - handleRemoveBtnClick - getProfileListChangeStatus before remove profile");
        const response = await dispatch(
            ProfileThunk.getProfileListChangeStatus({
                showGlobalLoading: true,
                networkErrorByDialog: true,
                networkErrorMsg: notAllowRemoveProfileInOfflineMsg,
                showCRSSVerifyMsg: false,
                needCacheLicense: false,
            })
        );

        if (!response.success || response.primaryIsInactivated) {
            return;
        }

        DialogHelper.showSelectDialog({
            title: "profile.removeProfile",
            okText: "profile.removeProfile",
            message: "profile.removeProfileMsg",
            okAction: () => handleRemove(response.profiles),
        });
    };

    const getProfileDetails = async () => {
        setLoading(true);
        try {
            await dispatch(ProfileThunk.initProfileDetails({ profileId }));
        } finally {
            setLoading(false);
        }
    };

    useFocus(() => {
        getProfileDetails();
    });

    useEffect(() => {
        setNoCacheData(!!profileDetails?.noCacheData);
    }, [profileDetails]);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("profile.profileDetails")} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={loading}
                        onRefresh={getProfileDetails}
                    />
                }
            >
                {loading || noCacheData ? (
                    <ProfileDetailsLoading isHeader />
                ) : (
                    <ProfileHeader profile={profileDetails} />
                )}

                <View style={{ padding: DEFAULT_MARGIN, paddingBottom: 0 }}>
                    <Text style={styles.address}>{t("profile.address")}</Text>

                    {loading || noCacheData ? (
                        <ProfileDetailsLoading />
                    ) : (
                        <View style={styles.infoBox}>
                            {addressInfo.map((item, index) => (
                                <RenderItem item={item} divider={index < addressInfo.length - 1} key={item.type} />
                            ))}
                        </View>
                    )}

                    <Text style={[styles.address, { marginTop: 36 }]}>{t("profile.basicInformation")}</Text>

                    {loading || noCacheData ? (
                        <ProfileDetailsLoading />
                    ) : (
                        <View style={styles.infoBox}>
                            {profilesInfo.map((item, index) => (
                                <RenderItem item={item} divider={index < profilesInfo.length - 1} key={item.type} />
                            ))}
                        </View>
                    )}

                    {loading || noCacheData ? (
                        <ProfileDetailsLoading />
                    ) : (
                        !isEmpty(customerRecordAttention) && (
                            <View style={[styles.attention, { marginTop: 36, paddingBottom: 18, marginBottom: 20 }]}>
                                <RenderHTML
                                    testID={genTestId("customerRecordAttention")}
                                    source={{
                                        html: customerRecordAttention,
                                    }}
                                    contentWidth={width}
                                    customerID={profileId}
                                />
                            </View>
                        )
                    )}

                    {!loading && !noCacheData && !isPrimaryOrCiu && (
                        <Pressable
                            onPress={handleRemoveBtnClick}
                            style={styles.bottomBtnBox}
                            testID={genTestId("removeProfileButton")}
                        >
                            <FontAwesomeIcon icon={faLinkSlash} size={28} color={AppTheme.colors.error} />
                            <Text style={styles.removeProfile}>{t("profile.removeProfile")}</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </Page>
    );
}

export default ProfileDetailsScreen;
