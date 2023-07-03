import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { selectors as profileSelectors } from "../redux/ProfileSlice";

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: 50,
        backgroundColor: AppTheme.colors.font_color_4,
        borderBottomColor: AppTheme.colors.primary_900,
        borderBottomWidth: 2,
    },
    label: {
        textAlignVertical: "center",
        ...AppTheme.typography.secondary_heading,
        paddingHorizontal: DEFAULT_MARGIN,
        color: AppTheme.colors.font_color_1,
    },
});

const WelcomeBar = () => {
    const { t } = useTranslation();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);

    return (
        <View style={styles.container}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                {t("home.greeting", { name: currentInUseProfile.displayName })}
            </Text>
        </View>
    );
};

export default WelcomeBar;
