import AppContract from "../assets/_default/AppContract";
import { appConfig } from "./AppConfigService";

export const getListData = (i18n, t, list = []) => {
    const data = list?.map((item) => {
        const title = i18n.exists(`contact.${item.titleKey}`) ? t(`contact.${item.titleKey}`) : item.titleKey;
        return { ...item, title };
    });
    return data;
};

export function getContactUsLinks(i18n, t) {
    const newContactList = AppContract.contactList;
    const {
        contactCDFWLink,
        contactAspiraLink,
        faqLink,
        contactCDFWDescription,
        contactCDFWEmail,
        contactCDFWPhone,
        cdfwWorkingHours,
        noFormatContactCDFWPhone,
        contactAspiraDescription,
        contactAspiraEmail,
        contactAspiraPhone,
        aspiraWorkingHours,
        noFormatContactAspiraPhone,
    } = appConfig.data;
    if (contactAspiraLink) {
        newContactList[0].url = contactAspiraLink;
        newContactList[0].desc = contactAspiraDescription;
        newContactList[0].email = contactAspiraEmail;
        newContactList[0].phone = contactAspiraPhone;
        newContactList[0].noFormatPhone = noFormatContactAspiraPhone;
        newContactList[0].workingHours = aspiraWorkingHours;
    }
    if (contactCDFWLink) {
        newContactList[1].url = contactCDFWLink;
        newContactList[1].desc = contactCDFWDescription;
        newContactList[1].email = contactCDFWEmail;
        newContactList[1].phone = contactCDFWPhone;
        newContactList[1].noFormatPhone = noFormatContactCDFWPhone;
        newContactList[1].workingHours = cdfwWorkingHours;
    }
    if (faqLink) {
        newContactList[2].url = faqLink;
    }

    return getListData(i18n, t, newContactList);
}

export function getSocialLinks(i18n, t) {
    const newSocialList = AppContract.socialList;
    const { facebookLink, twitterLink, youTubeLink, instagramLink, linkedinLink } = appConfig.data;
    if (facebookLink) {
        newSocialList[0].url = facebookLink;
    }
    if (twitterLink) {
        newSocialList[1].url = twitterLink;
    }
    if (youTubeLink) {
        newSocialList[2].url = youTubeLink;
    }
    if (instagramLink) {
        newSocialList[3].url = instagramLink;
    }
    if (linkedinLink) {
        newSocialList[4].url = linkedinLink;
    }
    return getListData(i18n, t, newSocialList);
}
