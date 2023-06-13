import * as React from "react";
import { StyleSheet, View } from "react-native";
import AppTheme from "../assets/_default/AppTheme";

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: AppTheme.colors.font_color_4,
        marginVertical: 10,
        width: 30,
    },
});

function SplitLine(props) {
    const { style = null } = props;
    return <View style={[styles.line, style]} />;
}

export default SplitLine;
