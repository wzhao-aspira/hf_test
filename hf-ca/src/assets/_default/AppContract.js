/* eslint-disable global-require */

import { merge } from "lodash";
import BaseContract from "../BaseContract";
import SecurityUtil from "../../utils/SecurityUtil";

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
        prod: "https://can-psapi-rest.reserveamerica.com/",
    },
    internetSalesURL: {
        // TODO: Waiting BA provide links for UAT & PROD
        qa: "https://qa.ca.wildlifelicense.com/prod/internetsales/",
        uat: "https://uat.ca.wildlifelicense.com/wp_test/internetsales/",
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
    ],
    contactList: [
        {
            titleKey: "contactCDFW",
            url: "https://wildlife.ca.gov/Contact",
        },
        {
            titleKey: "contactAspira",
            url: "https://www.ca.wildlifelicense.com/internetsales/Home/ContactAspira",
        },
        {
            titleKey: "FAQ",
            url: "https://www.ca.wildlifelicense.com/internetsales/Home/FAQ",
        },
    ],
    mapBoxAccessToken: SecurityUtil.xorDecrypt(
        "MRheDAsreQ8rHBkwKi8/Jxk5GCUlUCAlCT4ZJTErIA8rHBkwQBUkHywLGjNAVXwLBR9FDDYrMSQ7HxonKjd4JQUlCTMLK3FoMyM+ETcxfwNwNzZaMzcBCw5HPVkCFg==",
        true
    ),
};
export default merge(BaseContract, AppContract);
