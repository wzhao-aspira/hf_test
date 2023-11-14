import { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Trans, useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { DRAWER_WIDTH } from "../constants/Dimension";
import AppTheme from "../assets/_default/AppTheme";
import { getLogo } from "../helper/ImgHelper";
import SplitLine from "../components/SplitLine";
import { selectors as profileSelectors } from "../redux/ProfileSlice";
import Routers from "../constants/Routers";
import ProfileItem from "../screens/profile/manage_profile/ProfileItem";
import { genTestId, openLink } from "../helper/AppHelper";
import { updateLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import NavigationService from "./NavigationService";
import DialogHelper from "../helper/DialogHelper";
import { retrieveItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { handleError } from "../network/APIUtil";
import AccountService from "../services/AccountService";
import useNavigateToISPurchaseLicense from "../screens/licenses/hooks/useNavigateToISPurchaseLicense";
import { appConfig } from "../services/AppConfigService";
import useNavigateToISViewCustomerHarvestReports from "../screens/licenses/hooks/useNavigateToISViewCustomerHarvestReports";

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
        marginVertical: 10,
    },
    menuItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: 10,
    },
    menuTitleContainer: {
        width: "90%",
    },
    menuTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginLeft: 17,
        marginVertical: 5,
    },
    menuSplitLine: {
        backgroundColor: AppTheme.colors.body_100,
        width: "100%",
    },
    bottomArea: {
        width: "100%",
        marginTop: 15,
    },
    versionContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    versionText: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
        flex: 1,
    },
    privacy: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
        marginBottom: 12,
    },
});

function MenuItem(props) {
    const { title, onClick, showSplitLine = true, testID } = props;
    const { t } = useTranslation();
    const testIDPrefix = "HamburgerMenu";

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
                    <View style={styles.menuTitleContainer}>
                        <Text
                            testID={genTestId(`${testIDPrefix}${testID}ItemButtonLabel`)}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.menuTitle}
                        >
                            {t(title)}
                        </Text>
                    </View>
                    <FontAwesomeIcon icon={faChevronRight} size={16} color={AppTheme.colors.font_color_1} />
                </View>
            </Pressable>
            {showSplitLine && <SplitLine style={styles.menuSplitLine} />}
        </>
    );
}

export default function DrawerContent({ navigation }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const activeProfile = useSelector(profileSelectors.selectCurrentInUseProfile);

    const drawerStatus = useDrawerStatus();
    const drawerContentScrollView = useRef();

    const { navigateToIS } = useNavigateToISPurchaseLicense();
    const { navigateToViewCustomerHarvestReports } = useNavigateToISViewCustomerHarvestReports();

    const testIDPrefix = "HamburgerMenu";

    useEffect(() => {
        if (drawerStatus == "open") {
            drawerContentScrollView.current.scrollTo({ x: 0, y: 0, animated: false });
        }
    }, [drawerStatus]);

    const onSignOut = async () => {
        const notAllowSignOutInOfflineMsg = t("errMsg.notAllowSignOutInOfflineMsg");
        const response = await handleError(AccountService.signOut(), {
            dispatch,
            showLoading: true,
            networkErrorMsg: notAllowSignOutInOfflineMsg,
        });
        if (response.success) {
            dispatch(updateLoginStep(LoginStep.login));
            await AccountService.clearAppData(dispatch);
        }
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
        const { isDrawResultAvailable, isAccessPermitsAvailable } = appConfig.data;
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
                            NavigationService.navigate(Routers.licenseList);
                        }}
                        title="license.myActiveLicenses"
                        testID="MyActiveLicenses"
                    />
                    {isDrawResultAvailable && (
                        <MenuItem
                            onClick={async () => {
                                NavigationService.navigate(Routers.drawApplicationList);
                            }}
                            title="license.viewDrawApplication"
                            testID="ViewDrawApplications"
                        />
                    )}
                    {isAccessPermitsAvailable && (
                        <MenuItem
                            onClick={async () => {
                                NavigationService.navigate(Routers.accessPermitList);
                            }}
                            title="license.myActivePermits"
                            testID="MyActivePermits"
                        />
                    )}
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.preferencePoint);
                        }}
                        title="preferencePoint.viewPreferencePoint"
                        testID="ViewPreferencePoint"
                    />
                    <MenuItem
                        onClick={() => {
                            navigateToViewCustomerHarvestReports();
                        }}
                        title="hamburgerMenu.harvestReport"
                        testID="HarvestReport"
                    />
                    <MenuItem
                        onClick={() => {
                            navigateToIS();
                        }}
                        title="huntAndFish.purchaseTitle"
                        testID="PurchaseLicense"
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
                        <Trans i18nKey="hamburgerMenu.information" />
                    </Text>
                </View>
                <View style={styles.sectionContentContainer}>
                    <MenuItem
                        onClick={async () => {
                            const lastLocation = await retrieveItem(KEY_CONSTANT.keyLastLocation);
                            NavigationService.navigate(Routers.salesAgents, {
                                lastLocation,
                            });
                        }}
                        title="common.agentLocations"
                        testID="SalesAgents"
                    />
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.regulationList);
                        }}
                        title="hamburgerMenu.regulations"
                        testID="Regulations"
                    />
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.usefulLinks);
                        }}
                        title="hamburgerMenu.usefulLinks"
                        testID="usefulLinks"
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
                            navigation.navigate(Routers.followUs);
                        }}
                        title="common.followUs"
                        testID="FollowUs"
                    />
                    <MenuItem
                        onClick={() => {
                            navigation.navigate(Routers.contactUs);
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
                        DialogHelper.showSelectDialog({
                            title: "login.signOut",
                            message: "login.signOutTipMessage",
                            okAction: () => {
                                onSignOut();
                            },
                        });
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
        const appVersionNumber = t("common.appVersion", { appVersion: Constants.expoConfig?.version });
        const apiVersionNumber = t("common.apiVersion", { apiVersion: appConfig.data.apiVersion });
        return (
            <View style={styles.bottomArea}>
                <View style={styles.versionContainer}>
                    <Text
                        testID={genTestId(`${testIDPrefix}AppVersionLabel`)}
                        style={{ ...styles.versionText, textAlign: "right" }}
                    >
                        {appVersionNumber}
                    </Text>
                    <Text style={[styles.privacy, { marginHorizontal: 10 }]}>|</Text>
                    <Text
                        testID={genTestId(`${testIDPrefix}ApiVersionLabel`)}
                        style={{ ...styles.versionText, textAlign: "left" }}
                    >
                        {apiVersionNumber}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        testID={genTestId(`${testIDPrefix}PrivacyLink`)}
                        style={{ ...styles.privacy, flex: 1, textAlign: "right" }}
                        onPress={() => {
                            openLink(appConfig.data.privacyPolicyLink);
                        }}
                    >
                        <Trans i18nKey="hamburgerMenu.privacyPolicy" />
                    </Text>
                    <Text style={[styles.privacy, { marginHorizontal: 10 }]}>|</Text>
                    <Text
                        testID={genTestId(`${testIDPrefix}TermsOfUseLink`)}
                        style={{ ...styles.privacy, flex: 1, textAlign: "left" }}
                        onPress={() => {
                            openLink(appConfig.data.conditionOfUseLink);
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
        </View>
    );
}
