import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { selectLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import Routers from "../constants/Routers";
import LoginScreen from "../screens/login/LoginScreen";
import OnBoardingScreen from "../screens/onboarding/OnBoardingScreen";
import AppTheme from "../assets/_default/AppTheme";
import { DRAWER_WIDTH } from "../constants/Dimension";
import HomeScreen from "../screens/home/HomeScreen";
import HuntingScreen from "../screens/hunting/HuntingScreen";
import AddProfileScreen from "../screens/profile/add_profile/AddProfileScreen";
import AddPrimaryProfileScreen from "../screens/sign_up/AddPrimaryProfileScreen";
import DrawerContent from "./DrawerContent";
import TabContent from "./TabContent";
import LicenseListScreen from "../screens/licenses/LicenseListScreen";
import FishingScreen from "../screens/fish/FishingScreen";
import WeatherScreen from "../screens/discovery/WeatherScreen";
import SolunarScreen from "../screens/discovery/SolunarScreen";
import SignUpScreen from "../screens/sign_up/SignUpScreen";
import CRSSScreen from "../screens/shared/CRSSScreen";
import { navigationRef } from "./NavigationService";
import ManageProfileScreen from "../screens/profile/manage_profile/ManageProfileScreen";
import ProfileDetailsScreen from "../screens/profile/profile_details/ProfileDetailsScreen";
import SignInScreen from "../screens/sign_in/SignInScreen";
import SettingsScreen from "../screens/setting/SettingsScreen";
import DeleteAccountScreen from "../screens/delete-account/DeleteAccountScreen";
import ForgotPasswordEnterEmailScreen from "../screens/forgot_password/ForgotPasswordEnterEmailScreen";
import ForgotPasswordEnterValidationCodeScreen from "../screens/forgot_password/ForgotPasswordEnterValidationCodeScreen";
import ForgotPasswordResetPasswordScreen from "../screens/forgot_password/ForgotPasswordResetPasswordScreen";
import QuickAccessMethodsScreen from "../screens/setting/QuickAccessSettingScreen";
import ChangeLocationScreen from "../screens/discovery/ChangeLocationScreen";
import ContactUsScreen from "../screens/social_content/ContactUsScreen";
import FollowUsScreen from "../screens/social_content/FollowUsScreen";

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
    return route.name;
}

const AppNavigator = () => {
    const loginStep = useSelector(selectLoginStep);
    console.log(`loginStep:${loginStep}`);

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={NavTheme}
            onStateChange={(state) => {
                getActiveRouteName(state);
            }}
        >
            <RootStack.Navigator mode="modal" headerMode="none" screenOptions={screenOpt}>
                {loginStep === LoginStep.login && <RootStack.Screen name={Routers.login} component={LoginScreen} />}
                {loginStep === LoginStep.onBoarding && (
                    <RootStack.Screen name={Routers.onBoarding} component={OnBoardingScreen} />
                )}
                {loginStep === LoginStep.signUp && <RootStack.Screen name={Routers.signUpNav} component={SignUpNav} />}
                {loginStep === LoginStep.signIn && <RootStack.Screen name={Routers.signInNav} component={SignInNav} />}
                {loginStep === LoginStep.home && <RootStack.Screen name={Routers.drawerNav} component={DrawerNav} />}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

function SignInNav() {
    return (
        <SignInStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.signIn}>
            <SignInStack.Screen name={Routers.signIn} component={SignInScreen} />
            <SignInStack.Screen name={Routers.forgotPasswordEnterEmail} component={ForgotPasswordEnterEmailScreen} />
            <SignInStack.Screen
                name={Routers.forgotPasswordEnterValidationCode}
                component={ForgotPasswordEnterValidationCodeScreen}
            />
            <SignInStack.Screen
                name={Routers.forgotPasswordResetPassword}
                component={ForgotPasswordResetPasswordScreen}
            />
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
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen name={Routers.mainNav} component={MainNav} />
        </Drawer.Navigator>
    );
}

function MainNav() {
    return (
        <MainStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.tabNav}>
            <MainStack.Screen name={Routers.tabNav} component={TabNav} />
            <MainStack.Screen name={Routers.licenseList} component={LicenseListScreen} />
            <MainStack.Screen name={Routers.weather} component={WeatherScreen} />
            <MainStack.Screen name={Routers.solunar} component={SolunarScreen} />
            <MainStack.Screen name={Routers.changeLocation} component={ChangeLocationScreen} />
            <MainStack.Screen name={Routers.addProfile} component={AddProfileScreen} />
            <MainStack.Screen name={Routers.profileDetails} component={ProfileDetailsScreen} />
            <MainStack.Screen name={Routers.manageProfile} component={ManageProfileScreen} />
            <MainStack.Screen name={Routers.setting} component={SettingsScreen} />
            <MainStack.Screen name={Routers.deleteAccount} component={DeleteAccountScreen} />
            <MainStack.Screen name={Routers.quickAccessSetting} component={QuickAccessMethodsScreen} />
            <MainStack.Screen
                name={Routers.forgotPasswordResetPassword}
                component={ForgotPasswordResetPasswordScreen}
            />
            <MainStack.Screen name={Routers.contactUs} component={ContactUsScreen} />
            <MainStack.Screen name={Routers.followUs} component={FollowUsScreen} />
        </MainStack.Navigator>
    );
}

function SignUpNav() {
    return (
        <SignUpStack.Navigator screenOptions={screenOpt} headerMode="none" initialRouteName={Routers.signUp}>
            <SignUpStack.Screen name={Routers.signUp} component={SignUpScreen} />
            <SignUpStack.Screen name={Routers.addPrimaryProfile} component={AddPrimaryProfileScreen} />
            <SignUpStack.Screen name={Routers.crss} component={CRSSScreen} />
        </SignUpStack.Navigator>
    );
}

function TabNav() {
    return (
        // https://reactnavigation.org/docs/bottom-tab-navigator#tabbar
        <BottomTab.Navigator screenOptions={screenOpt} tabBar={(props) => <TabContent {...props} />}>
            <BottomTab.Screen name={Routers.home} component={HomeScreen} />
            <BottomTab.Screen name={Routers.hunting} component={HuntingScreen} />
            <BottomTab.Screen name={Routers.fishing} component={FishingScreen} />
        </BottomTab.Navigator>
    );
}

export default AppNavigator;
