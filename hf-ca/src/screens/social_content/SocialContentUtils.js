import { StyleSheet } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },

    title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: 25,
        marginHorizontal: DEFAULT_MARGIN,
    },

    list: {
        marginTop: 16,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
    },
    contentContainerStyle: {
        borderRadius: 10,
        overflow: "hidden",
    },
});
