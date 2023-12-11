import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import profileSelectors from "../redux/ProfileSelector";
import { isAssociatedProfile } from "../services/ProfileService";
import { genTestId } from "../helper/AppHelper";
import AppTheme from "../assets/_default/AppTheme";

const styles = StyleSheet.create({
    headerTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        flex: 1,
    },
    headerText: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        alignSelf: "stretch",
        textAlign: "center",
    },
});

function useTitle(withNameKey, withOutNameKey) {
    const { t } = useTranslation();
    let headerDisplayName;
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);

    if (isAssociatedProfile(currentInUseProfile?.profileType)) {
        headerDisplayName = currentInUseProfile?.displayName;
    } else {
        headerDisplayName = currentInUseProfile?.displayName?.split(" ")[0];
    }

    if (headerDisplayName) {
        return (
            <View style={styles.headerTextContainer}>
                <Text testID={genTestId("HeaderTitleLabel")} style={styles.headerText} numberOfLines={1}>
                    {t("common.headerDisplayName", { headerDisplayName })}
                </Text>
                <Text
                    testID={genTestId("HeaderTitleLabel")}
                    style={{ ...styles.headerText, marginTop: 2 }}
                    numberOfLines={1}
                >
                    {t(withNameKey)}
                </Text>
            </View>
        );
    }

    const withoutNameTitle = t(withOutNameKey);
    return (
        <View style={styles.headerTextContainer}>
            <Text testID={genTestId("HeaderTitleLabel")} style={styles.headerText} numberOfLines={2}>
                {withoutNameTitle}
            </Text>
        </View>
    );
}

export default useTitle;
