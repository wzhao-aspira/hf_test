import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { faShoppingCart } from "@fortawesome/pro-light-svg-icons/faShoppingCart";
import { useSelector } from "react-redux";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import HeaderBar from "../../components/HeaderBar";

import SplitLine from "../../components/SplitLine";
import { PAGE_MARGIN_BOTTOM, DEFAULT_MARGIN } from "../../constants/Dimension";
import HuntFishOtherInfo from "../shared/hunt_fish_content/HuntFishOtherInfo";
import HuntFishCardItem from "../shared/hunt_fish_content/HuntFishCardItem";
import useNavigateToISPurchaseLicense from "./hooks/useNavigateToISPurchaseLicense";
import { selectors as profileSelectors } from "../../redux/ProfileSlice";

const styles = StyleSheet.create({
    content: {
        paddingBottom: 0,
    },
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_4,
        marginTop: 23,
        marginHorizontal: DEFAULT_MARGIN,
    },
    line: {
        marginLeft: DEFAULT_MARGIN,
    },
    description: {
        ...AppTheme.typography.setting_sub_title,
        color: AppTheme.colors.font_color_4,
        marginTop: 5,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 23,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN / 2,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
    },
});

function RenderContent() {
    const { t } = useTranslation();

    const primaryColor = AppTheme.colors.hunting_green;

    const { navigateToIS } = useNavigateToISPurchaseLicense();
    const activeProfile = useSelector(profileSelectors.selectCurrentInUseProfile);

    if (!activeProfile) {
        return null;
    }
    return (
        <ScrollView>
            <HuntFishOtherInfo />

            <Text style={styles.sectionTitle}>{t("license.purchaseTitle")}</Text>

            <HuntFishCardItem
                title={t("huntAndFish.purchaseTitle")}
                description={t("huntAndFish.huntPurchaseDescription")}
                icon={faShoppingCart}
                primaryColor={primaryColor}
                onPress={() => {
                    navigateToIS();
                }}
            />

            <View style={{ height: PAGE_MARGIN_BOTTOM, width: "100%" }} />
        </ScrollView>
    );
}

export default function LicensesTabScreen() {
    const { t } = useTranslation();

    const primaryColor = AppTheme.colors.hunting_green;

    return (
        <Page style={styles.content}>
            <HeaderBar />
            <View style={{ backgroundColor: primaryColor }}>
                <Text style={styles.title}>{t("tabBar.tabLicenses")}</Text>
                <SplitLine style={styles.line} />
                <Text style={styles.description}>{null}</Text>
            </View>
            <RenderContent />
        </Page>
    );
}
