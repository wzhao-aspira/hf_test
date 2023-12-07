import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import Page from "../../components/Page";
import SeparateLine from "../../components/SeparateLine";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { selectors as profileSelectors } from "../../redux/ProfileSlice";
import { selectUsername } from "../../redux/AppSlice";
import HeaderBar from "../../components/HeaderBar";
import SplitLine from "../../components/SplitLine";
import QuickAccessChecker from "../../components/QuickAccessChecker";
import getAssociatedCustomerMaximum from "../../helper/ProfileHelper";

const styles = StyleSheet.create({
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_4,
        marginTop: 23,
        marginHorizontal: DEFAULT_MARGIN,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
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
    line: {
        marginLeft: DEFAULT_MARGIN,
    },
    description: {
        ...AppTheme.typography.setting_sub_title,
        color: AppTheme.colors.font_color_4,
        marginTop: 5,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 23,
    },
    manageProfileSecondLine: {
        ...AppTheme.typography.card_small_r,
        marginTop: -10,
        marginBottom: 16,
    },
});

const renderItem = (title, callBack, secondLine, secondLineStyle) => {
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
                        {secondLine && (
                            <Text style={secondLineStyle != null ? secondLineStyle : styles.itemText}>
                                {secondLine}
                            </Text>
                        )}
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

function RenderContent() {
    const { t } = useTranslation();
    const activeProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const userName = useSelector(selectUsername);
    const [quickAccessEnabled, setQuickAccessEnabled] = useState(false);
    const maxCustomerNumber = getAssociatedCustomerMaximum();
    let manageProfileSecondLine = null;
    if (maxCustomerNumber > 0) {
        manageProfileSecondLine = t("profile.maxCustomer", { maxCustomer: maxCustomerNumber });
    }
    if (!activeProfile) {
        return null;
    }
    return (
        <ScrollView contentContainerStyle={{ paddingBottom: PAGE_MARGIN_BOTTOM }}>
            <Text style={styles.sectionTitle}>{t("me.account")}</Text>
            <View style={styles.sectionContainer}>
                {renderItem(
                    t("profile.manageProfile"),
                    () => {
                        NavigationService.navigate(Routers.manageProfile);
                    },
                    manageProfileSecondLine,
                    styles.manageProfileSecondLine
                )}
                <SeparateLine />
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

            {quickAccessEnabled && (
                <>
                    <Text style={styles.sectionTitle}>{t("me.security")}</Text>
                    <View style={styles.sectionContainer}>
                        {renderItem(t("me.quickAccessSetting"), () => {
                            NavigationService.navigate(Routers.quickAccessSetting);
                        })}
                    </View>
                </>
            )}
            <QuickAccessChecker
                onChange={({ available }) => {
                    setQuickAccessEnabled(available);
                }}
            />
        </ScrollView>
    );
}

export default function SettingsTabScreen() {
    const { t } = useTranslation();
    const userName = useSelector(selectUsername);

    return (
        <Page style={{ paddingBottom: 0 }}>
            <HeaderBar />
            <View style={{ backgroundColor: AppTheme.colors.primary_2 }}>
                <Text style={styles.title}>{t("setting.title")}</Text>
                <SplitLine style={styles.line} />
                <Text style={styles.description}>{userName}</Text>
            </View>
            <RenderContent />
        </Page>
    );
}
