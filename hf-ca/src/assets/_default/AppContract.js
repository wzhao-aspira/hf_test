/* eslint-disable global-require */
import { merge } from "lodash";
import BaseContract from "../BaseContract";

const AppContract = {
    contractName: "CA",
    appId: "com.aspiraconnect.hf.ca",
    fonts: {
        Lato_Bold: require("./fonts/Lato-Bold.ttf"),
        Bold: require("./fonts/Roboto-Bold.ttf"),
        Medium: require("./fonts/Roboto-Medium.ttf"),
        Regular: require("./fonts/Roboto-Regular.ttf"),
    },
    URL: {
        qa: "https://uwp.ue1qa1.nonprod.aspiraint.com/",
        uat: "https://uatcan-psapirest.reserveamerica.com/",
        prod: "https://can-psapi-rest.reserveamerica.com/",
    },
};
export default merge(BaseContract, AppContract);
