import * as React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_BTN_RADIUS } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.font_color_4,
        borderWidth: 1,
        borderColor: AppTheme.colors.primary_2,
    },
    label: {
        ...AppTheme.typography.card_title,
        textAlign: "center",
        color: AppTheme.colors.font_color_1,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
});
function OutlinedBtn(props) {
    const { label = "Outlined Btn", onPress, testID, style = {} } = props;
    const calTestID = testID || label;
    return (
        <Pressable
            testID={genTestId(calTestID)}
            accessibilityLabel={label}
            style={[styles.container, { ...style }]}
            onPress={() => {
                if (onPress) onPress();
            }}
        >
            <Text numberOfLines={1} style={styles.label}>
                {label}
            </Text>
        </Pressable>
    );
}

export default OutlinedBtn;
