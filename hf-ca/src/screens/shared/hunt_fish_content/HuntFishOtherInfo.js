import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { CATEGORY } from "../../../constants/Constants";
import HuntFishOtherInfoItem from "./HuntFishOtherInfoItem";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";

const styles = StyleSheet.create({
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
    },

    otherInfo: {
        marginHorizontal: DEFAULT_MARGIN,
        borderRadius: 14,
        backgroundColor: AppTheme.colors.font_color_4,
        marginBottom: 41,
        ...AppTheme.shadow,
    },
});

function HuntFishOtherInfo(props) {
    const { t } = useTranslation();
    const defaultLicenseTitle = t("huntAndFish.myLicenses");
    const { category, myLicenseTitle = defaultLicenseTitle } = props;

    return (
        <View>
            <Text style={styles.sectionTitle}>{t("huntAndFish.otherInfomation")}</Text>
            <View style={styles.otherInfo}>
                <HuntFishOtherInfoItem
                    title={myLicenseTitle}
                    onPress={() => {
                        NavigationService.navigate(Routers.licenseList);
                    }}
                />
                {category == CATEGORY.Hunting && (
                    <HuntFishOtherInfoItem title={t("huntAndFish.myDrawApplications")} onPress={() => {}} />
                )}
                <HuntFishOtherInfoItem
                    title={t("preferencePoint.myPreferencePoint")}
                    onPress={() => {
                        NavigationService.navigate(Routers.preferencePoint);
                    }}
                />
                <HuntFishOtherInfoItem title={t("huntAndFish.ruleRegulations")} onPress={() => {}} />
                <HuntFishOtherInfoItem
                    title={t("huntAndFish.usefulLink")}
                    onPress={() => {
                        NavigationService.navigate(Routers.usefulLinks);
                    }}
                />
            </View>
        </View>
    );
}

export default HuntFishOtherInfo;
