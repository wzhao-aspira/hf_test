import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons";
import AppTheme from "../assets/_default/AppTheme";
import NavigationService from "../navigation/NavigationService";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";
import AppContract from "../assets/_default/AppContract";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    headerContainer: {
        flexDirection: "row",
        height: 64,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: DEFAULT_MARGIN,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: AppTheme.colors.primary_2,
        backgroundColor: AppTheme.colors.font_color_4,
    },
    headerTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        width: SCREEN_WIDTH - DEFAULT_MARGIN * 4,
    },
    headerText: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
    },
});

const CommonHeader = ({
    title,
    onBackClick = NavigationService.back,
    onRightClick = undefined,
    leftIcon = faChevronLeft,
    showLeft = true,
    rightIcon,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable
                    testID={genTestId("back_to_previous_page")}
                    accessibilityLabel={AppContract.accessibilityLabels.back_to_previous_page}
                    onPress={onBackClick}
                    style={{ flexDirection: "row", width: 20 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {showLeft && <FontAwesomeIcon icon={leftIcon} size={20} color={AppTheme.colors.primary_2} />}
                </Pressable>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText} numberOfLines={2}>
                        {title}
                    </Text>
                </View>
                <Pressable
                    onPress={onRightClick}
                    style={{ flexDirection: "row", width: 20 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {rightIcon && <FontAwesomeIcon icon={rightIcon} size={20} color={AppTheme.colors.primary_2} />}
                </Pressable>
            </View>
        </View>
    );
};

export default CommonHeader;
