import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { License } from "../types/license";
import type { DrawApplicationItem } from "../types/drawApplication";
import ValueOf from "../types/valueOf";
import { FileInfo } from "../types/accessPermit";

const Routers = {
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
    me: "MeScreen",
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
            fileInfoList: [FileInfo, FileInfo];
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
