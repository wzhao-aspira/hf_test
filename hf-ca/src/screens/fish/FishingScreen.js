import React from "react";
import { StyleSheet } from "react-native";
import HuntFishContent from "../shared/hunt_fish_content/HuntFishContent";
import { CATEGORY } from "../../constants/Constants";
import AppContract from "../../assets/_default/AppContract";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import HeaderBar from "../../components/HeaderBar";

const styles = StyleSheet.create({
    content: {
        paddingBottom: 0,
    },
});

export default function FishingScreen() {
    return (
        <Page style={styles.content}>
            <HeaderBar />
            <HuntFishContent
                category={CATEGORY.Fishing}
                title={AppContract.strings.fish_page_title}
                description={AppContract.strings.fish_page_description}
                primaryColor={AppTheme.colors.fishing_blue}
                purchaseDescription={AppContract.strings.fishPurchaseDescription}
            />
        </Page>
    );
}
