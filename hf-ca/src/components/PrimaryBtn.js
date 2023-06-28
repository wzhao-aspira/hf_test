import * as React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_BTN_RADIUS } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.primary_2,
    },
    label: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
});
const PrimaryBtn = ({ label = "Primary Btn", onPress, testID, style = {} }) => {
    const calTestID = testID || label;
    return (
        <Pressable
            testID={genTestId(calTestID)}
            accessibilityLabel={label}
            style={[styles.container, { ...style }]}
            onPress={() => {
                onPress && onPress();
            }}
        >
            <Text numberOfLines={1} style={styles.label}>
                {label}
            </Text>
        </Pressable>
    );
};

export default PrimaryBtn;
