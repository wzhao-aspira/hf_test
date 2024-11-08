import { merge } from "lodash";
import BaseContract from "../BaseContract";
import SecurityUtil from "../../utils/SecurityUtil";

export interface Contact {
    titleKey: string;
    url: string;
    desc: string;
    email: string;
    phone: string;
    noFormatPhone: string;
    workingHours: string;
}

export interface Social {
    titleKey: string;
    url: string;
}

const AppContract = {
    divisionCountry: "US",
    contractName: "CA",
    appStaticName: "HFCA",
    appId: "com.aspiraconnect.hf.ca",
    defaultStateId: 6,
    fonts: {
        Lato_Bold: require("./fonts/Lato-Bold.ttf"),
        Bold: require("./fonts/Roboto-Bold.ttf"),
        Medium: require("./fonts/Roboto-Medium.ttf"),
        Regular: require("./fonts/Roboto-Regular.ttf"),
    },
    URL: {
        qa: "https://qa.ca.wildlifelicense.com/",
        uat: "https://uat.ca.wildlifelicense.com/",
        prod: "https://www.ca.wildlifelicense.com",
        perf: "https://perf.ca.wildlifelicense.com",
    },
    internetSalesURL: {
        // TODO: Waiting BA provide links for UAT & PROD
        qa: "https://qa.ca.wildlifelicense.com/prod/internetsales/",
        uat: "https://uat.ca.wildlifelicense.com/uat_test/internetsales/",
        prod: "https://qa.ca.wildlifelicense.com/prod/internetsales/",
    },
    link: {
        helpAndSupportLink: "https://wildlife.ca.gov/Contact",
        privacyPolicy: "https://www.wildlife.ca.gov/Privacy-Policy",
        termService: "https://www.wildlife.ca.gov/Conditions-of-Use",
    },
    socialList: [
        {
            titleKey: "Facebook",
            url: "https://www.facebook.com/CaliforniaDFW/",
        },
        {
            titleKey: "Twitter",
            url: "https://twitter.com/CaliforniaDFW",
        },
        {
            titleKey: "YouTube",
            url: "https://www.youtube.com/CaliforniaDFG",
        },
        {
            titleKey: "Instagram",
            url: "https://www.instagram.com/californiadfw",
        },
        {
            titleKey: "LinkedIn",
            url: "https://www.linkedin.com/company/california-department-of-fish-and-wildlife",
        },
    ] as Social[],
    contactList: [
        {
            titleKey: "contactAspira",
            url: "https://www.ca.wildlifelicense.com/internetsales/Home/ContactAspira",
        },
        {
            titleKey: "contactCDFW",
            url: "https://wildlife.ca.gov/Contact",
        },
        {
            titleKey: "FAQ",
            url: "https://www.ca.wildlifelicense.com/internetsales/Home/FAQ",
        },
    ] as Contact[],
    mapBoxAccessToken: SecurityUtil.xorDecrypt(
        "MRheDAsreQ8rHBkwKi8/Jxk5GCUlUCAlCT4ZJTErIA8rHBkwQBUkHywLGjNAVXwLBR9FDDYrMSQ7HxonKjd4JQUlCTMLK3FoMyM+ETcxfwNwNzZaMzcBCw5HPVkCFg==",
        // @ts-expect-error
        true
    ),
};

export default merge(BaseContract, AppContract);
