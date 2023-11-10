import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { selectors as profileSelectors } from "../redux/ProfileSlice";
import SwitchCustomer from "./SwitchCustomer";
import { getLicense } from "../redux/LicenseSlice";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
        justifyContent: "space-between",
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
        flex: 1,
    },
    switchCustomer: {
        width: 110,
    },
});

function WelcomeBar() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    const showSwitchProfile = otherProfiles.length > 0;
    if (!currentInUseProfile) return null;

    const refreshLicense = async (activeProfileId) => {
        if (activeProfileId) {
            await dispatch(getLicense({ isForce: true, searchParams: { activeProfileId } }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                {t("home.greeting", { name: currentInUseProfile.displayName })}
            </Text>
            {showSwitchProfile && (
                <View style={styles.switchCustomer}>
                    <SwitchCustomer
                        postProcess={(profileId) => {
                            refreshLicense(profileId);
                        }}
                    />
                </View>
            )}
        </View>
    );
}

export default WelcomeBar;
