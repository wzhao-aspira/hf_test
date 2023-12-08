import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import HuntFishOtherInfoItem from "./HuntFishOtherInfoItem";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";
import selectors from "../../../redux/ProfileSelector";
import { appConfig } from "../../../services/AppConfigService";
import useNavigateToISViewCustomerHarvestReports from "../../licenses/hooks/useNavigateToISViewCustomerHarvestReports";

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
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const { navigateToViewCustomerHarvestReports } = useNavigateToISViewCustomerHarvestReports();

    const { isDrawResultAvailable, isAccessPermitsAvailable, isPreferencePointAvailable } = appConfig.data;
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
                {isDrawResultAvailable && (
                    <HuntFishOtherInfoItem
                        title={t("license.viewDrawApplication")}
                        onPress={() => {
                            NavigationService.navigate(Routers.drawApplicationList);
                        }}
                    />
                )}
                {isAccessPermitsAvailable && (
                    <HuntFishOtherInfoItem
                        title={t("license.myActivePermits")}
                        onPress={() => {
                            NavigationService.navigate(Routers.accessPermitList);
                        }}
                    />
                )}
                {isPreferencePointAvailable && (
                    <HuntFishOtherInfoItem
                        title={t("preferencePoint.viewPreferencePoint")}
                        onPress={() => {
                            NavigationService.navigate(Routers.preferencePoint);
                        }}
                    />
                )}
                <HuntFishOtherInfoItem
                    title={t("license.viewHarvestReport")}
                    onPress={() => {
                        navigateToViewCustomerHarvestReports();
                    }}
                />
                <HuntFishOtherInfoItem
                    title={t("profile.viewCustomerRecord")}
                    onPress={() => {
                        NavigationService.navigate(Routers.profileDetails, {
                            profileId: currentInUseProfileId,
                        });
                    }}
                />
            </View>
        </View>
    );
}

export default HuntFishOtherInfo;
