import { Pressable, ScrollView, Text } from "react-native";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import NavigationService from "./NavigationService";
import Routers from "../constants/Routers";
import { updateLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <ScrollView {...props} style={{ backgroundColor: AppTheme.colors.page_bg }}>
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
