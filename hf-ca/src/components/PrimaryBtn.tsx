import { StyleSheet, Pressable, Text } from "react-native";
import color from "color";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_BTN_RADIUS } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";
import { LoadingShimmer } from "./SkeletonLoader";

const styles = StyleSheet.create({
    container: {
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.primary_2,
    },
    disableContainer: {
        backgroundColor: color(AppTheme.colors.primary_2).alpha(0.5).rgb().string(),
    },
    label: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
});

function PrimaryBtn({
    label = "Primary Btn",
    onPress,
    testID,
    style = {},
    disabled = false,
    labelStyle = {},
    isLoading = false,
}) {
    const calTestID = testID || label;
    return (
        <LoadingShimmer isLoading={isLoading}>
            <Pressable
                testID={genTestId(calTestID)}
                accessibilityLabel={label}
                style={[styles.container, disabled && styles.disableContainer, { ...style }]}
                disabled={disabled}
                onPress={() => {
                    if (onPress) {
                        onPress();
                    }
                }}
            >
                {
                    <Text numberOfLines={1} style={[styles.label, labelStyle]}>
                        {label}
                    </Text>
                }
            </Pressable>
        </LoadingShimmer>
    );
}

export default PrimaryBtn;
