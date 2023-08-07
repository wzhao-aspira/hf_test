import { View, Text, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import HomeStyles from "../HomeStyles";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { genTestId } from "../../../helper/AppHelper";

const styles = StyleSheet.create({
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: 167,
        marginHorizontal: DEFAULT_MARGIN,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginTop: 3,
        marginBottom: 15,
    },
});

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 32;

const layout = [
    {
        width: width * 0.52,
        height: 16,
        borderRadius: 10,
    },
    {
        width: width * 0.16,
        height: 12,
        marginTop: 12,
        marginBottom: 38,
        borderRadius: 10,
    },
    {
        width,
        height: StyleSheet.hairlineWidth,
        marginBottom: 5,
    },
    [
        {
            width: width * 0.18,
            height: 12,
            marginTop: 18,
            borderRadius: 10,
        },
        {
            width: width * 0.18,
            height: 12,
            marginTop: 18,
            borderRadius: 10,
            marginRight: (width - 0.18 * width * 2) / 2,
        },
    ],
    [
        {
            width: width * 0.18 + 5,
            height: 12,
            marginTop: 5,
            borderRadius: 10,
        },
        {
            width: width * 0.18 + 5,
            height: 12,
            marginTop: 5,
            borderRadius: 10,
            marginRight: (width - 0.18 * width * 2) / 2 - 5,
        },
    ],
];

function HomeLicenseSectionLoading(props) {
    return (
        <View>
            <View style={HomeStyles.sectionTitleContainer}>
                <Text testID={genTestId("myLicense")} style={HomeStyles.sectionTitle}>
                    <Trans i18nKey="license.myLicense" />
                </Text>
            </View>

            <View style={{ marginTop: -3 }}>
                <View style={styles.card}>
                    <SkeletonLoader layout={layout} {...props} />
                </View>
            </View>
        </View>
    );
}

export default HomeLicenseSectionLoading;
