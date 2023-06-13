import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";

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
    const { title, subTitle, content, style } = props;
    return (
        <View style={[styles.container, style]}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={styles.title}>{title || "-"}</Text>
                {title && subTitle && <Text style={[styles.title, { fontSize: 20, lineHeight: 28 }]}>{subTitle}</Text>}
            </View>
            <Text style={styles.content}>{content || "-"}</Text>
        </View>
    );
}
