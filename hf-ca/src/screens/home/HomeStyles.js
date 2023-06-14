import { StyleSheet } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

const HomeStyles = StyleSheet.create({
    sectionTitleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: DEFAULT_MARGIN,
        marginTop: DEFAULT_MARGIN,
        marginBottom: 15,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
    },
    viewAllLabel: {
        ...AppTheme.typography.hyperLink,
        color: AppTheme.colors.primary_2,
    },
});

export default HomeStyles;
