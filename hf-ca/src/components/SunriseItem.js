import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, Text, StyleSheet } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: DEFAULT_MARGIN,
    },
    title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
    },
    itemContainer: {
        ...AppTheme.shadow,
        marginTop: 16,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: DEFAULT_RADIUS,
        padding: DEFAULT_MARGIN,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    value: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginTop: 3,
    },
});

export default function SunriseItem(props) {
    const { title, leftLabel, leftValue, icon, rightLabel, rightValue, testID = "" } = props;
    return (
        <View style={styles.container}>
            <Text testID={genTestId(`${testID}TitleLabel`)} style={styles.title}>
                {title}
            </Text>
            <View style={styles.itemContainer}>
                <View style={[styles.labelContainer, { flex: 1.2 }]}>
                    <Text testID={genTestId(`${testID}LeftTitleLabel`)} style={styles.label}>
                        {leftLabel}
                    </Text>
                    <Text testID={genTestId(`${testID}LeftValueLabel`)} style={styles.value}>
                        {leftValue || "-"}
                    </Text>
                </View>
                <View style={[styles.labelContainer, { alignItems: "flex-start" }]}>
                    <FontAwesomeIcon icon={icon} size={32} color={AppTheme.colors.primary} />
                </View>
                <View style={styles.labelContainer}>
                    <Text testID={genTestId(`${testID}RightTitleLabel`)} style={styles.label}>
                        {rightLabel}
                    </Text>
                    <Text testID={genTestId(`${testID}RightValueLabel`)} style={styles.value}>
                        {rightValue || "-"}
                    </Text>
                </View>
            </View>
        </View>
    );
}
