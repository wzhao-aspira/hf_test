import { StyleSheet } from "react-native";
import color from "color";
import AppTheme from "../assets/_default/AppTheme";

export const SharedStyles = StyleSheet.create({
    page_content_title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
    },
    page_content_text: {
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
    attention_label: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
        marginTop: 30,
        marginBottom: 15,
    },
});

export const statefulStyle = (style, disabled, error, focused = false) => {
    let textColor = style.color;
    let { borderColor, borderWidth } = style;
    if (disabled) {
        if (textColor) {
            textColor = color(textColor).alpha(0.5).toString();
        }
        if (borderColor) {
            borderColor = color(textColor).alpha(0.5).toString();
        }
    }
    if (error) {
        if (borderColor) {
            borderColor = AppTheme.colors.error;
        }
        if (borderWidth) {
            borderWidth = 2;
        }
    }
    if (focused) {
        if (borderWidth) {
            borderWidth = 2;
        }
    }
    return {
        ...style,
        color: textColor,
        borderColor,
        borderWidth,
    };
};
