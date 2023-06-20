import React from "react";
import { View, StyleSheet } from "react-native";
import AppTheme from "../assets/_default/AppTheme";

const styles = StyleSheet.create({
    line: {
        height: 1,
        marginHorizontal: 0,
        backgroundColor: AppTheme.colors.page_bg,
    },
});

export default function SeparateLine(props) {
    const { style } = props;
    return <View style={{ ...styles.line, ...style }} />;
}
