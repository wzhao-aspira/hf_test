import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Trans, useTranslation } from "react-i18next";
import { DRAWER_WIDTH } from "../constants/Dimension";
import AppTheme from "../assets/_default/AppTheme";
import { getLogo } from "../helper/ImgHelper";
import SplitLine from "../components/SplitLine";
import { selectors as profileSelectors } from "../redux/ProfileSlice";
import Routers from "../constants/Routers";
import ProfileItem from "../screens/profile/manage_profile/ProfileItem";
import { genTestId, setActiveUserID, showNotImplementedFeature } from "../helper/AppHelper";
import QuickAccessChecker from "../components/QuickAccessChecker";
import { showSelectDialog, updateLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";

const styles = StyleSheet.create({
    logoContainer: {
        flex: 1,
        alignItems: "center",
    },
    logo: {
        marginTop: 32,
        marginBottom: 16,
        width: DRAWER_WIDTH * 0.15,
        resizeMode: "cover",
        height: DRAWER_WIDTH * 0.15 * (768 / 581),
    },
    profileRowContainer: {
        backgroundColor: AppTheme.colors.body_50,
        marginBottom: 10,
    },
    profileRowSubContainer: {
        flexDirection: "row",
        height: 66,
        marginLeft: 17,
        marginRight: 9,
        alignItems: "center",
    },
    profileIconContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
        borderWidth: 3,
    },
    sectionTitleContainer: {
        marginTop: 15,
    },
    sectionTitle: {
        ...AppTheme.typography.overlay_hyperLink,
        color: AppTheme.colors.font_color_3,
        marginLeft: 17,
        marginRight: 20,
    },
    sectionContentContainer: {
        marginTop: 10,
    },
    menuItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: 10,
    },
    menuTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginLeft: 17,
        marginRight: 40,
        marginVertical: 5,
    },
    menuSplitLine: {
        backgroundColor: AppTheme.colors.body_100,
        width: "100%",
    },
    bottomArea: {
        width: "100%",
    },
    privacy: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
        marginBottom: 12,
    },
});

export default function DrawerContent({ navigation }) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const activeProfile = useSelector(profileSelectors.selectCurrentInUseProfile);

    const drawerStatus = useDrawerStatus();
    const drawerContentScrollView = useRef();
    const quickAccessChecker = useRef();

    const [quickAccessEnabled, setQuickAccessEnabled] = useState(false);

    const testIDPrefix = "HamburgerMenu";

    useEffect(() => {
        if (drawerStatus == "open") {
            drawerContentScrollView.current.scrollTo({ x: 0, y: 0, animated: false });
        }
    }, [drawerStatus]);

    const onSignOut = async () => {
        // Clear the mobile account that saved in local storage
        await setActiveUserID(null);
        // Set login step
        dispatch(updateLoginStep(LoginStep.login));
    };

    const MenuItem = (props) => {
        const { title, onClick, showSplitLine = true, testID } = props;
        return (
            <>
                <Pressable
                    testID={genTestId(`${testIDPrefix}${testID}ItemButton`)}
                    onPress={() => {
                        if (onClick) {
                            onClick();
                        }
                    }}
                >
                    <View style={styles.menuItemContainer}>
                        <Text testID={genTestId(`${testIDPrefix}${testID}ItemButtonLabel`)} style={styles.menuTitle}>
                            {t(title)}
                        </Text>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color={AppTheme.colors.font_color_1} />
                    </View>
                </Pressable>
                {showSplitLine && <SplitLine style={styles.menuSplitLine} />}
            </>
        );
    };

    const renderProfileSection = () => {
        return (
            <ProfileItem
                showGoToDetailsPageButton
                showNameInOneLine
                profile={activeProfile}
                onPress={() =>
                    navigation.navigate(Routers.profileDetails, {
                        profileId: activeProfile.profileId,
                    })
                }
                profileItemStyles={{
                    pressable: styles.profileRowContainer,
                    container: styles.profileRowSubContainer,
                    shortNameContainer: styles.profileIconContainer,
                }}
            />
        );
    };

    const renderGeneralSection = () => {
        return (
            <>
                <View style={styles.sectionTitleContainer}>
                    <Text testID={genTestId(`${testIDPrefix}GeneralSectionLabel`)} style={styles.sectionTitle}>
                        <Trans i18nKey="hamburgerMenu.general" />
                    </Text>
                </View>
                <View style={styles.sectionContentContainer}>
                    <MenuItem
                        onClick={() => {
                            showNotImplementedFeature();
                        }}
                        title="common.purchase"
                        testID="PurchasePrivilege"
                    />
                    <MenuItem
                        onClick={() => {
                            showNotImplementedFeature();
                        }}
                        title="common.agentLocations"
                        testID="SalesAgents"
                    />
                </View>
            </>
        );
    };

    const renderAccountSection = () => {
        return (
            <>
                <View style={styles.sectionTitleContainer}>
                    <Text testID={genTestId(`${testIDPrefix}AccountSectionLabel`)} style={styles.sectionTitle}>
                        <Trans i18nKey="common.account" />
                    </Text>
                </View>
                <View style={styles.sectionContentContainer}>
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.manageProfile);
                        }}
                        title="profile.manageProfile"
                        testID="ManageProfiles"
                    />
                    {quickAccessEnabled && (
                        <MenuItem
                            onClick={() => {
                                showNotImplementedFeature();
                            }}
                            title="hamburgerMenu.quickAccess"
                            testID="QuickAccess"
                        />
                    )}
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.setting);
                        }}
                        title="hamburgerMenu.settings"
                        testID="Settings"
                    />
                </View>
            </>
        );
    };

    const renderContactUsSection = () => {
        return (
            <>
                <View style={styles.sectionTitleContainer}>
                    <Text testID={genTestId(`${testIDPrefix}ContactUsSectionLabel`)} style={styles.sectionTitle}>
                        <Trans i18nKey="common.contactUs" />
                    </Text>
                </View>
                <View style={styles.sectionContentContainer}>
                    <MenuItem
                        onClick={() => {
                            showNotImplementedFeature();
                        }}
                        title="common.followUs"
                        testID="FollowUs"
                    />
                    <MenuItem
                        onClick={() => {
                            showNotImplementedFeature();
                        }}
                        title="common.contactUs"
                        testID="ContactUs"
                    />
                </View>
            </>
        );
    };

    const renderSignOutSection = () => {
        return (
            <View style={styles.sectionContentContainer}>
                <Pressable
                    testID={genTestId(`${testIDPrefix}SignOutItemButton`)}
                    onPress={() => {
                        dispatch(
                            showSelectDialog({
                                title: "login.signOut",
                                message: "login.signOutTipMessage",
                                okAction: () => {
                                    onSignOut();
                                },
                            })
                        );
                    }}
                >
                    <Text testID={genTestId(`${testIDPrefix}SignOutItemButtonLabel`)} style={styles.menuTitle}>
                        <Trans i18nKey="login.signOut" />
                    </Text>
                </Pressable>
            </View>
        );
    };

    const renderBottomSection = () => {
        return (
            <View style={styles.bottomArea}>
                <SplitLine style={styles.menuSplitLine} />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        testID={genTestId(`${testIDPrefix}PrivacyLink`)}
                        style={styles.privacy}
                        onPress={() => {
                            showNotImplementedFeature();
                        }}
                    >
                        <Trans i18nKey="hamburgerMenu.privacyPolicy" />
                    </Text>
                    <Text style={[styles.privacy, { marginHorizontal: 10 }]}>|</Text>
                    <Text
                        testID={genTestId(`${testIDPrefix}TermsOfUseLink`)}
                        style={styles.privacy}
                        onPress={() => {
                            showNotImplementedFeature();
                        }}
                    >
                        <Trans i18nKey="hamburgerMenu.termsOfService" />
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} ref={drawerContentScrollView}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={getLogo()} />
                </View>
                {renderProfileSection()}
                {renderGeneralSection()}
                {renderAccountSection()}
                {renderContactUsSection()}
                {renderSignOutSection()}
            </ScrollView>
            {renderBottomSection()}
            <QuickAccessChecker
                ref={quickAccessChecker}
                onHardwareInfo={(available) => {
                    setQuickAccessEnabled(available);
                }}
            />
        </View>
    );
}
