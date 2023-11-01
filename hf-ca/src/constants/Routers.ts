import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { License } from "../types/license";
import type { DrawApplicationItem } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { FileInfo } from "../types/accessPermit";

const Routers = {
    splash: "splash",
    accessPermitDetail: "accessPermitDetail",
    addProfile: "addProfileScreen",
    addBusinessVesselProfile: "addBusinessVesselProfileScreen",
    addIndividualProfile: "addIndividualProfileScreen",
    addIndividualProfileDetails: "addIndividualProfileDetailsScreen",
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
    licenses: "LicenseScreen",
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
    settings: "settings",
    signIn: "signIn",
    signInNav: "signInNav",
    signUp: "signUpScreen",
    signUpNav: "signUpNav",
    solunar: "solunarScreen",
    tabNav: "tabNav",
    usefulLinks: "usefulLinsScreen",
    weather: "weatherScreen",
    webView: "webViewScreen",
    regulationList: "regulationListScreen",
    regulationDetail: "RegulationDetailScreen",
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
        title?: RoutersUnion;
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
