import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { License } from "../types/license";
import type { DrawApplicationItem } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { FileInfo } from "../types/accessPermit";

const Routers = {
    accessPermit: "accessPermit",
    accessPermitDetail: "accessPermitDetail",
    accessPermitList: "accessPermitList",
    addBusinessVesselProfile: "addBusinessVesselProfileScreen",
    addIndividualProfile: "addIndividualProfileScreen",
    addIndividualProfileDetails: "addIndividualProfileDetailsScreen",
    addProfile: "addProfileScreen",
    changeLocation: "ChangeLocationScreen",
    contactUs: "contactUs",
    crss: "crssScreen",
    current: "current",
    deleteAccount: "deleteAccountScreen",
    drawApplicationDetail: "drawApplicationDetailScreen",
    drawApplicationList: "drawApplicationListScreen",
    drawerNav: "drawerNav",
    followUs: "followUs",
    forgotPasswordEnterEmail: "forgotPasswordEnterEmailScreen",
    forgotPasswordResetPassword: "forgotPasswordResetPasswordScreen",
    home: "homeScreen",
    licenseDetail: "licenseDetailScreen",
    licenseList: "licenseList",
    mobileAlertsList: "mobileAlertsList",
    mobileAlertDetail: "mobileALertDetail",
    login: "loginScreen",
    mainNav: "mainNav",
    manageProfile: "ManageProfile",
    menu: "menu",
    modal: "modal",
    myLicenses: "myLicensesScreen",
    onBoarding: "onBoardingScreen",
    preferencePoint: "preferencePoint",
    profileDetails: "profileDetailsScreen",
    quickAccessSetting: "quickAccessSetting",
    regulationDetail: "RegulationDetailScreen",
    regulationList: "regulationListScreen",
    salesAgents: "salesAgents",
    settings: "settings",
    signIn: "signIn",
    signInNav: "signInNav",
    signUp: "signUpScreen",
    signUpNav: "signUpNav",
    solunar: "solunarScreen",
    splash: "splash",
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
            fileInfoList: [FileInfo, FileInfo];
            isGeneratedDraw: boolean;
            huntCode: string;
            huntRange: string;
            isDisplayReservation: boolean;
        };
    };
    webViewScreen: {
        url: string;
        title?: string;
    };
    licenseDetailScreen: {
        licenseData: License;
    };
    drawApplicationDetailScreen: {
        drawApplicationDetailData: {
            isGeneratedDraw: boolean;
            title: string;
            DrawApplicationChoices: DrawApplicationItem[];
        };
    };
};

type AppNativeStackScreenProps<RouteName extends keyof RouteParams> = NativeStackScreenProps<RouteParams, RouteName>;

const useAppNavigation = useNavigation<NavigationProp<RouteParams>>;

export type { RoutersUnion, AppNativeStackScreenProps };
export { useAppNavigation };
export default Routers;
