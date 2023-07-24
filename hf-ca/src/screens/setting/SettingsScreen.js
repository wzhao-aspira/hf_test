import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import SeparateLine from "../../components/SeparateLine";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { selectors as profileSelectors } from "../../redux/ProfileSlice";
import { selectUsername } from "../../redux/AppSlice";

const styles = StyleSheet.create({
    titleArea: {
        backgroundColor: AppTheme.colors.primary_2,
        minHeight: 136,
        marginBottom: 32,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_4,
        marginHorizontal: DEFAULT_MARGIN,
        textAlign: "center",
    },
    sectionContainer: {
        marginHorizontal: DEFAULT_MARGIN,
        borderRadius: 14,
        backgroundColor: AppTheme.colors.font_color_4,
        marginBottom: 20,
        ...AppTheme.shadow,
    },
    itemContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingLeft: 16,
    },
    itemTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginVertical: 18,
    },
    itemText: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        marginTop: -10,
        marginBottom: 16,
    },
    itemRightArrow: {
        marginLeft: 5,
        marginRight: 16,
        alignSelf: "center",
    },
});

const renderItem = (title, callBack, secondLine) => {
    return (
        <View>
            <Pressable
                onPress={() => {
                    callBack();
                }}
            >
                <View style={styles.itemContainer}>
                    <View>
                        <Text style={styles.itemTitle}>{title}</Text>
                        {secondLine && <Text style={styles.itemText}>{secondLine}</Text>}
                    </View>

                    <FontAwesomeIcon
                        style={styles.itemRightArrow}
                        icon={faChevronRight}
                        size={15}
                        color={AppTheme.colors.primary_2}
                    />
                </View>
            </Pressable>
        </View>
    );
};

export default function SettingsScreen() {
    const { t } = useTranslation();
    const activeProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const userName = useSelector(selectUsername);

    if (!activeProfile) return null;

    return (
        <Page style={{ paddingBottom: 0 }}>
            <CommonHeader title={t("hamburgerMenu.settings")} />
            <ScrollView contentContainerStyle={{ paddingBottom: PAGE_MARGIN_BOTTOM }}>
                <View style={styles.titleArea}>
                    <Text style={styles.title}>{userName}</Text>
                </View>

                <View style={styles.sectionContainer}>
                    {renderItem(t("setting.changePassword"), () => {
                        NavigationService.navigate(Routers.forgotPasswordResetPassword, {
                            emailAddress: userName,
                            isChangePassword: true,
                        });
                    })}
                    <SeparateLine />
                    {renderItem(t("setting.deleteAccount"), () => {
                        NavigationService.navigate(Routers.deleteAccount);
                    })}
                </View>
                <View style={styles.sectionContainer}>
                    {renderItem(t("profile.manageProfile"), () => {
                        NavigationService.navigate(Routers.manageProfile);
                    })}
                </View>
            </ScrollView>
        </Page>
    );
}
