import { View, Text, StyleSheet } from "react-native";
import { isNumber } from "lodash";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: (DEFAULT_MARGIN * 2) / 3,
        paddingHorizontal: DEFAULT_MARGIN,
    },
    title: {
        ...AppTheme.typography.temperature,
        color: AppTheme.colors.font_color_1,
    },
    content: {
        paddingTop: 8,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
});

export default function WeatherItem(props) {
    const { testID = "", title, subTitle, content, style } = props;
    const numTitle = isNumber(title) ? `${title}` : title;
    return (
        <View style={[styles.container, style]}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text testID={genTestId(`${testID}WeatherItemTitleLabel`)} style={styles.title}>
                    {numTitle || "-"}
                </Text>
                {numTitle && subTitle && (
                    <Text
                        testID={genTestId(`${testID}WeatherItemSubTitleLabel`)}
                        style={[styles.title, { fontSize: 20, lineHeight: 28 }]}
                    >
                        {subTitle}
                    </Text>
                )}
            </View>
            <Text testID={genTestId(`${testID}WeatherItemContentLabel`)} style={styles.content}>
                {content || "-"}
            </Text>
        </View>
    );
}
