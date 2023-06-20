import React from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/pro-light-svg-icons";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import ProfileItem from "./ProfileItem";
import { commonStyles } from "./Styles";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import { genTestId } from "../../../helper/AppHelper";

export default function OtherProfiles({ otherProfiles = [] }) {
    const { t } = useTranslation();

    return (
        <View style={{ marginTop: 36 }}>
            <Text style={commonStyles.subTitle}>{t("profile.otherProfiles")}</Text>
            <Pressable
                style={{ marginTop: 16 }}
                onPress={() => {
                    NavigationService.navigate(Routers.addProfile);
                }}
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

            {otherProfiles.map((profile) => (
                <ProfileItem
                    profileItemStyles={{
                        container: commonStyles.profileContainer,
                        shortNameContainer: commonStyles.profileShortNameContainer,
                        pressable: { marginTop: 20 },
                    }}
                    showGoToDetailsPageButton
                    key={profile.profileId}
                    profile={profile}
                    onPress={() => {}}
                />
            ))}
        </View>
    );
}
