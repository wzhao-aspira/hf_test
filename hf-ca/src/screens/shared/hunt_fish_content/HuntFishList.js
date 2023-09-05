import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { faClipboardList } from "@fortawesome/pro-light-svg-icons/faClipboardList";
import { faShoppingCart } from "@fortawesome/pro-light-svg-icons/faShoppingCart";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import HuntFishCardItem from "./HuntFishCardItem";
import useNavigateToISPurchaseLicense from "../../licenses/hooks/useNavigateToISPurchaseLicense";

export const styles = StyleSheet.create({
    section: {
        marginBottom: -20,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
    },
});

function HuntFishList(props) {
    const { primaryColor, purchaseDescription } = props;
    const { t } = useTranslation();
    const { navigateToIS } = useNavigateToISPurchaseLicense();

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("huntAndFish.dongingTitle")}</Text>

            <HuntFishCardItem
                title={t("huntAndFish.reportTitle")}
                description={t("huntAndFish.reportDescription")}
                icon={faClipboardList}
                primaryColor={primaryColor}
                onPress={() => {
                    console.log("harvest report");
                }}
            />

            <HuntFishCardItem
                title={t("huntAndFish.purchaseTitle")}
                description={purchaseDescription}
                icon={faShoppingCart}
                primaryColor={primaryColor}
                onPress={() => {
                    navigateToIS();
                }}
            />
        </View>
    );
}

export default HuntFishList;
