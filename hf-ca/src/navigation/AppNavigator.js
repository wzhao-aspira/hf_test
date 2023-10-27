import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { selectLoginStep } from "../redux/AppSlice";
import { DRAWER_WIDTH } from "../constants/Dimension";
import LoginStep from "../constants/LoginStep";
import Routers from "../constants/Routers";
import AppTheme from "../assets/_default/AppTheme";
import DrawerContent from "./DrawerContent";
import TabContent from "./TabContent";
import { navigationRef } from "./NavigationService";

import AccessPermitDetailScreen from "../screens/access_permits/AccessPermitDetailScreen";
import AddProfileScreen from "../screens/profile/add_profile/AddProfileScreen";
import ChangeLocationScreen from "../screens/discovery/ChangeLocationScreen";
import ContactUsScreen from "../screens/social_content/ContactUsScreen";
import CRSSScreen from "../screens/shared/CRSSScreen";
import DeleteAccountScreen from "../screens/delete_account/DeleteAccountScreen";
import DrawApplicationDetailScreen from "../screens/draw_application/detail/DrawApplicationDetailScreen";
import FollowUsScreen from "../screens/social_content/FollowUsScreen";
import ForgotPasswordEnterEmailScreen from "../screens/forgot_password/ForgotPasswordEnterEmailScreen";
import ForgotPasswordResetPasswordScreen from "../screens/forgot_password/ForgotPasswordResetPasswordScreen";
import HomeScreen from "../screens/home/HomeScreen";
import LicenseDetailScreen from "../screens/licenses/LicenseDetailScreen";
import LicenseListScreen from "../screens/licenses/LicenseListScreen";
import LoginScreen from "../screens/login/LoginScreen";
import ManageProfileScreen from "../screens/profile/manage_profile/ManageProfileScreen";
import ModalScreen from "./ModalScreen";
import OnBoardingScreen from "../screens/onboarding/OnBoardingScreen";
import PreferencePointScreen from "../screens/preference_point/PreferencePointScreen";
import ProfileDetailsScreen from "../screens/profile/profile_details/ProfileDetailsScreen";
import QuickAccessMethodsScreen from "../screens/setting/QuickAccessSettingScreen";
import SalesAgentsScreen from "../screens/sales_agents/SalesAgentsScreen";
import AccessPermitListScreen from "../screens/access_permits/AccessPermitListScreen";
import AccessPermitScreen from "../screens/access_permits/AccessPermitScreen";
import SettingsScreen from "../screens/setting/SettingsScreen";
import SignInScreen from "../screens/sign_in/SignInScreen";
import SignUpScreen from "../screens/sign_up/SignUpScreen";
import SolunarScreen from "../screens/discovery/SolunarScreen";
import UsefulLinksScreen from "../screens/useful_links/UsefulLinksScreen";
import WeatherScreen from "../screens/discovery/WeatherScreen";
import WebViewScreen from "../screens/web_view/WebViewScreen";
import AddIndividualProfileInfoScreen from "../screens/profile/add_profile/AddIndividualProfileInfoScreen";
import AddIndividualProfileInfoDetailsScreen from "../screens/profile/add_profile/AddIndividualProfileInfoDetailsScreen";
import AddBusinessVesselProfileInfoScreen from "../screens/profile/add_profile/AddBusinessVesselProfileInfoScreen";
import NetInfoBar from "../components/NetInfoBar";
import LicensesTabScreen from "../screens/licenses/LicenseTabScreen";
import MeTabScreen from "../screens/me/MeTabScreen";
import DrawApplicationListScreen from "../screens/draw_application/list/DrawApplicationListScreen";
import RegulationListScreen from "../screens/regulation/list/RegulationListScreen";
import RegulationDetailScreen from "../screens/regulation/detail/RegulationDetailScreen";
import { isIos } from "../helper/AppHelper";
import RenderSplash from "../components/AppSplash";

const NavTheme = {
    colors: {
        background: AppTheme.colors.page_bg,
    },
};
const RootStack = createNativeStackNavigator();
const SignInStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const screenOpt = {
    gestureEnabled: false,
    animationEnabled: false,
    headerShown: false,
    presentation: "card",
};

const iOSDialogScreenOpt = { presentation: "transparentModal", animation: "none", orientation: "portrait" };
const androidDialogScreenOpt = { presentation: "transparentModal", animation: "none" };

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.state) {
        return getActiveRouteName(route.state);
    }
    console.log(`route.name:${route.name}`);
    Routers.current = route.name;
    return route.name;
}

function AppNavigator() {
    const loginStep = useSelector(selectLoginStep);
    console.log(`loginStep:${loginStep}`);

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer
                ref={navigationRef}
                theme={NavTheme}
                onStateChange={(state) => {
                    getActiveRouteName(state);
                }}
            >
                <RootStack.Navigator mode="modal" headerMode="none" screenOptions={{ ...screenOpt, animation: "none" }}>
                    <RootStack.Group>
                        {loginStep === LoginStep.splash && (
                            <RootStack.Screen name={Routers.splash} component={RenderSplash} />
                        )}
                        {loginStep === LoginStep.login && (
                            <RootStack.Screen name={Routers.login} component={LoginScreen} />
                        )}
                        {loginStep === LoginStep.onBoarding && (
                            <RootStack.Screen name={Routers.onBoarding} component={OnBoardingScreen} />
                        )}
                        {loginStep === LoginStep.signUp && (
                            <RootStack.Screen name={Routers.signUpNav} component={SignUpNav} />
                        )}
                        {loginStep === LoginStep.signIn && (
                            <RootStack.Screen name={Routers.signInNav} component={SignInNav} />
                        )}
                        {loginStep === LoginStep.home && (
                            <RootStack.Screen name={Routers.drawerNav} component={DrawerNav} />
                        )}
                    </RootStack.Group>
                    <RootStack.Group screenOptions={isIos() ? iOSDialogScreenOpt : androidDialogScreenOpt}>
                        <RootStack.Screen name={Routers.modal} component={ModalScreen} />
                    </RootStack.Group>
                </RootStack.Navigator>
            </NavigationContainer>
            {loginStep != LoginStep.splash && <NetInfoBar />}
        </View>
    );
}

function SignInNav() {
    return (
        <SignInStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.signIn}>
            <SignInStack.Screen name={Routers.signIn} component={SignInScreen} />
            <SignInStack.Screen name={Routers.forgotPasswordEnterEmail} component={ForgotPasswordEnterEmailScreen} />
            <SignInStack.Screen
                name={Routers.forgotPasswordResetPassword}
                component={ForgotPasswordResetPasswordScreen}
            />
            <SignInStack.Screen name={Routers.addIndividualProfile} component={AddIndividualProfileInfoScreen} />
            <SignInStack.Screen
                name={Routers.addIndividualProfileDetails}
                component={AddIndividualProfileInfoDetailsScreen}
            />
            <SignInStack.Screen
                name={Routers.addBusinessVesselProfile}
                component={AddBusinessVesselProfileInfoScreen}
            />
            <SignInStack.Screen name={Routers.crss} component={CRSSScreen} />
            <SignInStack.Screen name={Routers.signUpNav} component={SignUpNav} />
        </SignInStack.Navigator>
    );
}

function DrawerNav() {
    return (
        <Drawer.Navigator
            initialRouteName={Routers.mainNav}
            screenOptions={{
                ...screenOpt,
                drawerPosition: "right",
                swipeEnabled: false,
                drawerStyle: {
                    width: DRAWER_WIDTH,
                    backgroundColor: AppTheme.colors.font_color_4,
                },
                drawerType: "front",
            }}
            detachInactiveScreens={false}
            // https://reactnavigation.org/docs/drawer-navigator#providing-a-custom-drawercontent
            drawerContent={DrawerContent}
        >
            <Drawer.Screen name={Routers.mainNav} component={MainNav} />
            <Drawer.Screen
                name={Routers.salesAgents}
                component={SalesAgentsScreen}
                options={{
                    unmountOnBlur: true,
                }}
            />
        </Drawer.Navigator>
    );
}

function MainNav() {
    return (
        <MainStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.tabNav}>
            <MainStack.Screen name={Routers.accessPermitDetail} component={AccessPermitDetailScreen} />
            <MainStack.Screen name={Routers.addProfile} component={AddProfileScreen} />
            <MainStack.Screen name={Routers.addIndividualProfile} component={AddIndividualProfileInfoScreen} />
            <MainStack.Screen
                name={Routers.addIndividualProfileDetails}
                component={AddIndividualProfileInfoDetailsScreen}
            />
            <MainStack.Screen name={Routers.addBusinessVesselProfile} component={AddBusinessVesselProfileInfoScreen} />
            <MainStack.Screen name={Routers.changeLocation} component={ChangeLocationScreen} />
            <MainStack.Screen name={Routers.contactUs} component={ContactUsScreen} />
            <MainStack.Screen name={Routers.crss} component={CRSSScreen} />
            <MainStack.Screen name={Routers.deleteAccount} component={DeleteAccountScreen} />
            <MainStack.Screen name={Routers.drawApplicationDetail} component={DrawApplicationDetailScreen} />
            <MainStack.Screen name={Routers.drawApplicationList} component={DrawApplicationListScreen} />
            <MainStack.Screen name={Routers.followUs} component={FollowUsScreen} />
            <MainStack.Screen
                name={Routers.forgotPasswordResetPassword}
                component={ForgotPasswordResetPasswordScreen}
            />
            <MainStack.Screen name={Routers.licenseDetail} component={LicenseDetailScreen} />
            <MainStack.Screen name={Routers.licenseList} component={LicenseListScreen} />
            <MainStack.Screen name={Routers.accessPermitList} component={AccessPermitListScreen} />
            <MainStack.Screen name={Routers.accessPermit} component={AccessPermitScreen} />
            <MainStack.Screen name={Routers.manageProfile} component={ManageProfileScreen} />
            <MainStack.Screen name={Routers.preferencePoint} component={PreferencePointScreen} />
            <MainStack.Screen name={Routers.profileDetails} component={ProfileDetailsScreen} />
            <MainStack.Screen name={Routers.quickAccessSetting} component={QuickAccessMethodsScreen} />
            <MainStack.Screen name={Routers.setting} component={SettingsScreen} />
            <MainStack.Screen name={Routers.solunar} component={SolunarScreen} />
            <MainStack.Screen name={Routers.tabNav} component={TabNav} />
            <MainStack.Screen name={Routers.usefulLinks} component={UsefulLinksScreen} />
            <MainStack.Screen name={Routers.weather} component={WeatherScreen} />
            <MainStack.Screen name={Routers.webView} component={WebViewScreen} />
            <MainStack.Screen name={Routers.regulationList} component={RegulationListScreen} />
            <MainStack.Screen name={Routers.regulationDetail} component={RegulationDetailScreen} />
        </MainStack.Navigator>
    );
}

function SignUpNav() {
    return (
        <SignUpStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.signUp}>
            <SignUpStack.Screen name={Routers.signUp} component={SignUpScreen} />
            <SignUpStack.Screen name={Routers.addIndividualProfile} component={AddIndividualProfileInfoScreen} />
            <SignUpStack.Screen
                name={Routers.addIndividualProfileDetails}
                component={AddIndividualProfileInfoDetailsScreen}
            />
            <SignUpStack.Screen name={Routers.crss} component={CRSSScreen} />
        </SignUpStack.Navigator>
    );
}

function TabNav() {
    return (
        // https://reactnavigation.org/docs/bottom-tab-navigator#tabbar
        <BottomTab.Navigator screenOptions={screenOpt} tabBar={TabContent}>
            <BottomTab.Screen name={Routers.home} component={HomeScreen} />
            <BottomTab.Screen name={Routers.licenses} component={LicensesTabScreen} />
            <BottomTab.Screen name={Routers.me} component={MeTabScreen} />
        </BottomTab.Navigator>
    );
}

export default AppNavigator;
