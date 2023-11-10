import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/pro-regular-svg-icons/faArrowRightArrowLeft";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectors as profileSelectors } from "../redux/ProfileSlice";
import AppTheme from "../assets/_default/AppTheme";
import SwitchProfileDialog from "../screens/profile/manage_profile/SwitchProfileDialog";
import { genTestId } from "../helper/AppHelper";
import DialogHelper from "../helper/DialogHelper";
import NavigationService from "../navigation/NavigationService";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: AppTheme.colors.primary,
        ...AppTheme.typography.hyperLink,
        marginLeft: 4,
        flex: 1,
    },
});

export default function SwitchCustomer({ postProcess }) {
    const { t } = useTranslation();
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    const showSwitchProfile = otherProfiles.length > 0;

    function handleSwitchClick() {
        DialogHelper.showCustomDialog({
            renderDialogContent: () => (
                <SwitchProfileDialog
                    hideDialog={() => {
                        NavigationService.back();
                    }}
                    postProcess={(profileId) => {
                        if (postProcess) {
                            postProcess(profileId);
                        }
                    }}
                    showListUpdatedMsg={false}
                />
            ),
        });
    }

    return showSwitchProfile ? (
        <Pressable
            testID={genTestId(`switchCustomer`)}
            onPress={handleSwitchClick}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            <View style={styles.container}>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} size={12} color={AppTheme.colors.primary} />
                <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                    {t("common.switchCustomer")}
                </Text>
            </View>
        </Pressable>
    ) : null;
}
