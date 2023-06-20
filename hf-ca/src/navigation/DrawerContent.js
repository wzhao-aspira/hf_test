import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import NavigationService from "./NavigationService";
import Routers from "../constants/Routers";
import { updateLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import { getActiveProfile } from "../redux/ProfileSlice";
import ProfileItem from "../screens/profile/manage_profile/ProfileItem";

const styles = StyleSheet.create({
    // TODO: Temporary style, please match the style of figma
    profileItemContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: AppTheme.colors.font_color_4,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
});

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const activeProfile = useSelector(getActiveProfile);

    return (
        <ScrollView {...props} style={{ backgroundColor: AppTheme.colors.page_bg }}>
            <ProfileItem
                showGoToDetailsPageButton
                profile={activeProfile}
                profileItemStyles={{ container: styles.profileItemContainer }}
            />
            <Pressable
                onPress={() => {
                    console.log("manager profile");
                    NavigationService.navigate(Routers.manageProfile);
                }}
            >
                <Text>{t("profile.manageProfile")}</Text>
            </Pressable>

            <Pressable
                onPress={() => {
                    console.log("sign out");
                    dispatch(updateLoginStep(LoginStep.login));
                }}
            >
                <Text>{t("login.signOut")}</Text>
            </Pressable>
        </ScrollView>
    );
};
export default DrawerContent;
