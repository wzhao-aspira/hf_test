import { View, StyleSheet, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { selectors as profileSelectors } from "../redux/ProfileSlice";
import SwitchCustomer from "./SwitchCustomer";
import { getLicense } from "../redux/LicenseSlice";
import { getLogo, getLogoRatio } from "../helper/ImgHelper";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingRight: 10,
        paddingVertical: 16,
        justifyContent: "space-between",
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
    rightContainer: {
        alignItems: "flex-end",
    },
    switchCustomer: {
        width: 110,
    },
    logo: {
        width: 35 * getLogoRatio(),
        height: 35,
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
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{t("home.greeting")}</Text>
                <Text style={{ ...styles.label, paddingTop: 7 }} numberOfLines={1} ellipsizeMode="tail">
                    {currentInUseProfile.displayName}!
                </Text>
            </View>

            <View style={styles.rightContainer}>
                <Image style={styles.logo} source={getLogo()} testID={genTestId("logo")} />
                {showSwitchProfile && (
                    <View style={styles.switchCustomer}>
                        <SwitchCustomer
                            postProcess={(profileId) => {
                                refreshLicense(profileId);
                            }}
                            closeLoadingBeforeProfileCallback
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

export default WelcomeBar;
