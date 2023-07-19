import * as React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import color from "color";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import { BtnSizeEnum, BtnTypeEnum } from "../constants/Constants";
import { genTestId } from "../helper/AppHelper";

const labelPaddingVertical = 15;
const labelPaddingHorizontal = 20;

const styles = StyleSheet.create({
    // touchable container
    // borderRadius, borderWidth, borderColor, backgroundColor,
    primaryTouchableStyle: {
        borderRadius: 4,
        backgroundColor: AppTheme.colors.primary_2,
    },
    primaryTouchableDisableStyle: {
        borderRadius: 4,
        backgroundColor: color(AppTheme.colors.primary_2).alpha(0.5).rgb().string(),
    },
    primaryTouchableRevertStyle: {
        borderRadius: 4,
        backgroundColor: AppTheme.colors.font_color_4,
    },
    primaryTouchableRevertDisableStyle: {
        borderRadius: 4,
        backgroundColor: color(AppTheme.colors.font_color_4).alpha(0.5).rgb().string(),
    },

    secondaryTouchableStyle: {
        borderRadius: 4,
        backgroundColor: AppTheme.colors.font_color_4,
        borderWidth: 1,
        borderColor: AppTheme.colors.primary_2,
    },
    secondaryTouchableDisableStyle: {
        borderRadius: 4,
        backgroundColor: color(AppTheme.colors.font_color_4).alpha(0.5).rgb().string(),
        borderWidth: 1,
        borderColor: AppTheme.colors.primary_2,
    },
    secondaryTouchableRevertStyle: {
        borderRadius: 4,
        backgroundColor: AppTheme.colors.primary_2,
        borderWidth: 1,
        borderColor: AppTheme.colors.font_color_4,
    },
    secondaryTouchableDisableRevertStyle: {
        borderRadius: 4,
        backgroundColor: color(AppTheme.colors.primary_2).alpha(0.5).rgb().string(),
        borderWidth: 1,
        borderColor: AppTheme.colors.font_color_4,
    },

    // label
    // textColor
    primaryLargeLabel: {
        ...AppTheme.typography.card_title,
        textAlign: "center",
        color: AppTheme.colors.font_color_4,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    primarySmallLabel: {
        ...AppTheme.typography.button_text,
        textAlign: "center",
        color: AppTheme.colors.font_color_4,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    primaryLargeRevertLabel: {
        ...AppTheme.typography.card_title,
        textAlign: "center",
        color: AppTheme.colors.font_color_1,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    primarySmallRevertLabel: {
        ...AppTheme.typography.button_text,
        textAlign: "center",
        color: AppTheme.colors.font_color_1,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },

    secondaryLargeLabel: {
        ...AppTheme.typography.card_title,
        textAlign: "center",
        color: AppTheme.colors.font_color_1,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    secondarySmallLabel: {
        ...AppTheme.typography.button_text,
        textAlign: "center",
        color: AppTheme.colors.font_color_1,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    secondaryLargeRevertLabel: {
        ...AppTheme.typography.card_title,
        textAlign: "center",
        color: AppTheme.colors.font_color_4,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
    secondarySmallRevertLabel: {
        ...AppTheme.typography.button_text,
        textAlign: "center",
        color: AppTheme.colors.font_color_4,
        paddingVertical: labelPaddingVertical,
        paddingHorizontal: labelPaddingHorizontal,
    },
});

export default function ConfirmButton(props) {
    const { t } = useTranslation();

    const {
        testID = "",
        style = null,
        textStyle = null,
        disabled = false,
        revert = false,
        label,
        size = BtnSizeEnum.Large,
        type = BtnTypeEnum.Primary,
        onPress = () => {
            console.log("app btn action");
        },
        onLayout,
    } = props;

    let touchableStyle = null;
    let labelStyle = null;

    const largeLabel = size == BtnSizeEnum.Large;
    const primaryType = type == BtnTypeEnum.Primary;
    const secondaryType = type == BtnTypeEnum.Secondary;
    if (primaryType) {
        touchableStyle = disabled ? styles.primaryTouchableDisableStyle : styles.primaryTouchableStyle;
        labelStyle = largeLabel ? styles.primaryLargeLabel : styles.primarySmallLabel;
        if (revert) {
            touchableStyle = disabled ? styles.primaryTouchableRevertDisableStyle : styles.primaryTouchableRevertStyle;
            labelStyle = largeLabel ? styles.primaryLargeRevertLabel : styles.primarySmallRevertLabel;
        }
    }
    if (secondaryType) {
        touchableStyle = disabled ? styles.secondaryTouchableDisableStyle : styles.secondaryTouchableStyle;
        labelStyle = largeLabel ? styles.secondaryLargeLabel : styles.secondarySmallLabel;
        if (revert) {
            touchableStyle = disabled
                ? styles.secondaryTouchableDisableRevertStyle
                : styles.secondaryTouchableRevertStyle;
            labelStyle = largeLabel ? styles.secondaryLargeRevertLabel : styles.secondarySmallRevertLabel;
        }
    }

    return (
        <Pressable
            testID={genTestId(`${testID}ConfirmButton`)}
            disabled={disabled}
            style={[touchableStyle, style]}
            onPress={() => {
                onPress();
            }}
            onLayout={onLayout}
        >
            <Text testID={genTestId(`${testID}ConfirmButtonLabel`)} numberOfLines={1} style={[labelStyle, textStyle]}>
                {t(label)}
            </Text>
        </Pressable>
    );
}
