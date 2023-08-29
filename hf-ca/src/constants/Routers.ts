import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { License } from "../types/license";
import ValueOf from "../types/valueOf";

const Routers = {
    accessPermitDetail: "accessPermitDetail",
    addPrimaryProfile: "addPrimaryProfileScreen",
    addProfile: "addProfileScreen",
    changeLocation: "ChangeLocationScreen",
    contactUs: "contactUs",
    crss: "crssScreen",
    current: "current",
    deleteAccount: "deleteAccountScreen",
    drawerNav: "drawerNav",
    fishing: "fishingScreen",
    followUs: "followUs",
    forgotPasswordEnterEmail: "forgotPasswordEnterEmailScreen",
    forgotPasswordResetPassword: "forgotPasswordResetPasswordScreen",
    home: "homeScreen",
    hunting: "huntingScreen",
    licenseDetail: "licenseDetailScreen",
    licenseList: "licenseList",
    login: "loginScreen",
    mainNav: "mainNav",
    manageProfile: "ManageProfile",
    modal: "modal",
    onBoarding: "onBoardingScreen",
    preferencePoint: "preferencePoint",
    profileDetails: "profileDetailsScreen",
    quickAccessSetting: "quickAccessSetting",
    salesAgents: "salesAgents",
    accessPermitList: "accessPermitList",
    accessPermit: "accessPermit",
    setting: "setting",
    signIn: "signIn",
    signInNav: "signInNav",
    signUp: "signUpScreen",
    signUpNav: "signUpNav",
    solunar: "solunarScreen",
    tabNav: "tabNav",
    usefulLinks: "usefulLinsScreen",
    weather: "weatherScreen",
    webView: "webViewScreen",
} as const;

type RoutersUnion = ValueOf<typeof Routers>;

export type RouteParams = {
    accessPermitDetail: {
        document: {
            title: string;
            barcode: string;
            huntDate: string;
            huntName: string;
            reservationNumber: string;
            name: string;
            address: string;
        };
    };
    webViewScreen: {
        url: string;
        title?: RoutersUnion;
    };
    licenseDetailScreen: {
        licenseData: License;
    };
};

type AppNativeStackScreenProps<RouteName extends keyof RouteParams> = NativeStackScreenProps<RouteParams, RouteName>;

const useAppNavigation = useNavigation<NavigationProp<RouteParams>>;

export type { RoutersUnion, AppNativeStackScreenProps };
export { useAppNavigation };
export default Routers;
