import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft";
import AppTheme from "../assets/_default/AppTheme";
import NavigationService from "../navigation/NavigationService";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppTheme.colors.font_color_4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: AppTheme.colors.primary_2,
    },
    headerContainer: {
        flexDirection: "row",
        height: 64,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: DEFAULT_MARGIN,
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
    subHeaderContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -25,
        paddingVertical: 5,
    },
    headerSubTitleText: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
});

function CommonHeader({
    testID = "",
    title,
    onBackClick = NavigationService.back,
    onRightClick = undefined,
    leftIcon = faChevronLeft,
    showLeft = true,
    rightIcon,
    subTitle,
}) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable
                    testID={genTestId(`${testID}BackToPreviousPageButton`)}
                    onPress={showLeft ? onBackClick : null}
                    style={{ flexDirection: "row", width: 20 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {showLeft && <FontAwesomeIcon icon={leftIcon} size={20} color={AppTheme.colors.primary_2} />}
                </Pressable>
                <View style={styles.headerTextContainer}>
                    <Text testID={genTestId(`${testID}HeaderTitleLabel`)} style={styles.headerText} numberOfLines={2}>
                        {title}
                    </Text>
                </View>
                <Pressable
                    testID={genTestId(`${testID}GoToNextPageButton`)}
                    onPress={onRightClick}
                    style={{ flexDirection: "row", width: 20 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {rightIcon && <FontAwesomeIcon icon={rightIcon} size={20} color={AppTheme.colors.primary_2} />}
                </Pressable>
            </View>
            {subTitle && (
                <View style={styles.subHeaderContainer}>
                    <Text
                        testID={genTestId(`${testID}SubTitleLabel`)}
                        style={styles.headerSubTitleText}
                        numberOfLines={1}
                    >
                        {subTitle}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default CommonHeader;
