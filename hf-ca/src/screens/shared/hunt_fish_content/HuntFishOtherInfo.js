import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import HuntFishOtherInfoItem from "./HuntFishOtherInfoItem";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";
import { showNotImplementedFeature } from "../../../helper/AppHelper";

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

function HuntFishOtherInfo() {
    const { t } = useTranslation();

    return (
        <View>
            <Text style={styles.sectionTitle}>{t("license.importantInformation")}</Text>
            <View style={styles.otherInfo}>
                <HuntFishOtherInfoItem
                    title={t("license.myActiveLicenses")}
                    onPress={() => {
                        NavigationService.navigate(Routers.licenseList);
                    }}
                />
                <HuntFishOtherInfoItem
                    title={t("license.viewDrawApplication")}
                    onPress={() => {
                        showNotImplementedFeature();
                    }}
                />
                <HuntFishOtherInfoItem
                    title={t("license.myActivePermits")}
                    onPress={() => {
                        NavigationService.navigate(Routers.accessPermitList);
                    }}
                />
                <HuntFishOtherInfoItem
                    title={t("preferencePoint.viewPreferencePoint")}
                    onPress={() => {
                        NavigationService.navigate(Routers.preferencePoint);
                    }}
                />
            </View>
        </View>
    );
}

export default HuntFishOtherInfo;
