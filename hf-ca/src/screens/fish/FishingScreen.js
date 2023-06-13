import React from "react";
import { StyleSheet } from "react-native";
import HuntFishContent from "../../components/HuntFishContent";
import { CATEGORY } from "../../constants/Constants";
import AppContract from "../../assets/_default/AppContract";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";

const styles = StyleSheet.create({
    content: {
        paddingBottom: 0,
    },
});

export default function FishingScreen() {
    return (
        <Page style={styles.content}>
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
