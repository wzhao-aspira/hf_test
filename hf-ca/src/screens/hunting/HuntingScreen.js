import React from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import HuntFishContent from "../shared/hunt_fish_content/HuntFishContent";
import { CATEGORY } from "../../constants/Constants";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import HeaderBar from "../../components/HeaderBar";

const styles = StyleSheet.create({
    content: {
        paddingBottom: 0,
    },
});

export default function HuntingScreen() {
    const { t } = useTranslation();

    return (
        <Page style={styles.content}>
            <HeaderBar />
            <HuntFishContent
                category={CATEGORY.Hunting}
                title={t("huntAndFish.huntTitle")}
                description={t("huntAndFish.huntDescription")}
                primaryColor={AppTheme.colors.hunting_green}
                purchaseDescription={t("huntAndFish.huntPurchaseDescription")}
            />
        </Page>
    );
}
