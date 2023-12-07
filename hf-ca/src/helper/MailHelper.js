import Constants from "expo-constants";
import * as Device from "expo-device";
import * as MailComposer from "expo-mail-composer";
import { isEmpty } from "lodash";
import i18n from "../localization/i18n";

function contactUsViaEmail(mailAddress, openSimpleDialog) {
    if (isEmpty(mailAddress)) {
        console.log(`email is empty:${mailAddress}`);
        return;
    }

    const version = Constants.expoConfig?.ios?.buildNumber;
    let bodyString = `\n\n\n\n\n${i18n.t("mail.appVersion")}: ${version}\n`;
    bodyString += `${i18n.t("mail.device")}: ${Device.modelName}\n`;
    bodyString += `${i18n.t("mail.osVersion")}: ${Device.osVersion}\n`;
    console.log(`mail body:${bodyString}`);
    const options = {
        recipients: [mailAddress],
        subject: i18n.t("mail.subject"),
        body: bodyString,
    };

    MailComposer.composeAsync(options)
        .then((status) => {
            console.log(`send mail----${status}`);
        })
        .catch(() => {
            openSimpleDialog({
                title: "mail.emailNotSetup",
                message: "mail.emailNotSetupMsg",
                okText: "common.gotIt",
            });
        });
}

export default contactUsViaEmail;
