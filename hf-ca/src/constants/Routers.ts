const Routers = {
    current: "current",
    modal: "modal",
    signInNav: "signInNav",
    drawerNav: "drawerNav",
    mainNav: "mainNav",
    signUpNav: "signUpNav",
    tabNav: "tabNav",
    login: "loginScreen",
    onBoarding: "onBoardingScreen",
    licenseList: "licenseList",
    home: "homeScreen",
    hunting: "huntingScreen",
    fishing: "fishingScreen",
    weather: "weatherScreen",
    solunar: "solunarScreen",
    changeLocation: "ChangeLocationScreen",
    crss: "crssScreen",
    signUp: "signUpScreen",
    addProfile: "addProfileScreen",
    addPrimaryProfile: "addPrimaryProfileScreen",
    profileDetails: "profileDetailsScreen",
    manageProfile: "ManageProfile",
    signIn: "signIn",
    setting: "setting",
    deleteAccount: "deleteAccountScreen",
    forgotPasswordEnterEmail: "forgotPasswordEnterEmailScreen",
    forgotPasswordResetPassword: "forgotPasswordResetPasswordScreen",
    quickAccessSetting: "quickAccessSetting",
    contactUs: "contactUs",
    followUs: "followUs",
    preferencePoint: "preferencePoint",
    salesAgents: "salesAgents",
    webView: "webViewScreen",
    usefulLinks: "usefulLinsScreen",
} as const;

type ValueOf<T> = T[keyof T];

type RoutersUnion = ValueOf<typeof Routers>;

export { RoutersUnion };
export default Routers;
