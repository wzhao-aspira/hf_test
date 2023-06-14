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

export default function HuntingScreen() {
    return (
        <Page style={styles.content}>
            <HeaderBar />
            <HuntFishContent
                category={CATEGORY.Hunting}
                title={AppContract.strings.hunt_page_title}
                description={AppContract.strings.hunt_page_description}
                primaryColor={AppTheme.colors.hunting_green}
                purchaseDescription={AppContract.strings.huntPurchaseDescription}
            />
        </Page>
    );
}
