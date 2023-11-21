import { View, Text, StyleSheet, Pressable } from "react-native";
import { Trans } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft";
import AppTheme from "../assets/_default/AppTheme";
import NavigationService from "../navigation/NavigationService";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

// LEFT_BLACK + LEFT_WIDTH = RIGHT_WIDTH + RIGHT_PADDING
const LEFT_BLACK = 60;
const LEFT_WIDTH = 20;
const RIGHT_PADDING = 4;

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
        paddingLeft: DEFAULT_MARGIN,
        paddingRight: RIGHT_PADDING,
    },
    headerLeftContainer: {
        flexDirection: "row",
        width: LEFT_WIDTH,
        marginRight: LEFT_BLACK - DEFAULT_MARGIN,
    },
    headerTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        flex: 1,
    },
    headerRightContainer: {
        width: LEFT_BLACK + LEFT_WIDTH - RIGHT_PADDING,
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
    leftIcon = faChevronLeft,
    showLeft = true,
    rightComponent = null,
    subTitle = "",
    subTitleStyle = {},
    isWebViewScreen = false,
}) {
    const blank = rightComponent ? LEFT_BLACK : DEFAULT_MARGIN;
    const rightComponentWidth = blank + LEFT_WIDTH - RIGHT_PADDING;
    const leftContainerMarginRight = blank - DEFAULT_MARGIN;

    const isWebViewScreenWithTitle = isWebViewScreen && title;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable
                    accessibilityLabel="Go Back"
                    testID={genTestId(`${testID}BackToPreviousPageButton`)}
                    onPress={showLeft ? onBackClick : null}
                    style={[
                        styles.headerLeftContainer,
                        { marginRight: leftContainerMarginRight },
                        isWebViewScreen && { width: 100, alignItems: "center" },
                        isWebViewScreenWithTitle && { width: 50 },
                    ]}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {showLeft && <FontAwesomeIcon icon={leftIcon} size={20} color={AppTheme.colors.primary_2} />}
                    {isWebViewScreen && (
                        <Text
                            style={{
                                ...AppTheme.typography.hyperLink,
                            }}
                        >
                            <Trans i18nKey="webview.BackToApp" />
                        </Text>
                    )}
                </Pressable>
                <View style={styles.headerTextContainer}>
                    <Text testID={genTestId(`${testID}HeaderTitleLabel`)} style={styles.headerText} numberOfLines={2}>
                        {title}
                    </Text>
                </View>
                <View style={[styles.headerRightContainer, { width: rightComponentWidth }]}>{rightComponent}</View>
            </View>
            {subTitle && (
                <View style={styles.subHeaderContainer}>
                    <Text
                        testID={genTestId(`${testID}SubTitleLabel`)}
                        style={[styles.headerSubTitleText, subTitleStyle]}
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
