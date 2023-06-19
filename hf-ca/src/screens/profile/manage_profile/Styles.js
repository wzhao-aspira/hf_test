import { StyleSheet } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";

export const commonStyles = StyleSheet.create({
    subTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
    },
    profileContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 20,
        ...AppTheme.shadow,
    },
    profileShortNameContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderColor: AppTheme.colors.secondary_900,
        borderWidth: 3,
    },

    profileShortName: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },

    profileDisplayName: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },

    profileItemNumber: {
        marginTop: 5,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    divider: {
        height: 1,
        backgroundColor: AppTheme.colors.divider,
        marginTop: 22,
        marginHorizontal: -20,
    },
});

export const dialogStyles = StyleSheet.create({
    switchProfileContainer: {
        paddingTop: 6,
        paddingBottom: 28,
        overflow: "hidden",
        height: "100%",
    },
    shortNameContainer: (circleRadius) => ({
        ...commonStyles.profileShortNameContainer,
        width: circleRadius * 2,
        height: circleRadius * 2,
        borderRadius: circleRadius,
    }),
    profileItemContainer: { flexDirection: "row", marginTop: 22, alignItems: "center", paddingHorizontal: 20 },
});

export const profileScreenStyles = StyleSheet.create({
    container: {
        paddingBottom: 0,
        backgroundColor: AppTheme.colors.page_bg,
    },
    contentContainer: {
        paddingHorizontal: DEFAULT_MARGIN,
        paddingTop: 28,
    },

    switchProfile: {
        ...AppTheme.typography.hyperLink,
        color: AppTheme.colors.primary_2,
    },

    horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
});
