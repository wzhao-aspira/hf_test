import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: 50,
        backgroundColor: AppTheme.colors.font_color_4,
        borderBottomColor: AppTheme.colors.primary_900,
        borderBottomWidth: 2,
        marginBottom: 30,
    },
    label: {
        textAlignVertical: "center",
        ...AppTheme.typography.secondary_heading,
        paddingHorizontal: DEFAULT_MARGIN,
        color: AppTheme.colors.font_color_1,
    },
});

const WelcomeBar = (props) => {
    const { firstName = "Hannah" } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                Welcome, {firstName}
            </Text>
        </View>
    );
};

export default WelcomeBar;
