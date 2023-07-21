import { View, Text, StyleSheet } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../constants/Dimension";
import HomeStyles from "./HomeStyles";
import SkeletonLoader from "../../components/SkeletonLoader";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: DEFAULT_MARGIN,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: 180,
        width: (SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 18) / 2,
        borderRadius: DEFAULT_RADIUS,
        paddingHorizontal: 20,
    },
    bottomContainer: {
        height: 56,
        width: "100%",
        marginBottom: 0,
        borderTopColor: AppTheme.colors.page_bg,
        borderTopWidth: 1,
        alignSelf: "center",
        justifyContent: "center",
    },
    cardBottomLabel: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
});

const width = (SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 18) / 2;

function HomeDiscoverySectionLoading() {
    const { t } = useTranslation();

    const layout = [
        {
            width: width * 0.38,
            height: 12,
            marginTop: 28,
            borderRadius: 10,
        },
        {
            width: width * 0.68,
            height: 12,
            marginTop: 15,
            borderRadius: 10,
        },
        {
            width: width * 0.38,
            height: 12,
            marginTop: 30,
            marginBottom: 13,
            borderRadius: 10,
        },
    ];

    const renderCard = (title, testID) => {
        return (
            <View style={styles.card}>
                <SkeletonLoader layout={layout} />
                <View style={styles.bottomContainer}>
                    <Text testID={genTestId(`${testID}BottomLabel`)} style={styles.cardBottomLabel}>
                        {title}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View>
            <View style={HomeStyles.sectionTitleContainer}>
                <Text testID={genTestId("DiscoveryLabel")} style={HomeStyles.sectionTitle}>
                    <Trans i18nKey="discovery.discovery" />
                </Text>
            </View>
            <View style={styles.cardContainer}>
                {renderCard(t("discovery.weather"), "Weather")}
                {renderCard(t("discovery.solunar"), "Solunar")}
            </View>
        </View>
    );
}

export default HomeDiscoverySectionLoading;
