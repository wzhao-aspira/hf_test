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
        contactCDFWEmail,
        contactCDFWPhone,
        cdfwWorkingHours,
        contactAspiraEmail,
        contactAspiraPhone,
        aspiraWorkingHours,
    } = appConfig.data;
    if (contactCDFWLink) {
        newContactList[0].url = contactCDFWLink;
        newContactList[0].email = contactCDFWEmail;
        newContactList[0].phone = contactCDFWPhone;
        newContactList[0].workingHours = cdfwWorkingHours;
    }
    if (contactAspiraLink) {
        newContactList[1].url = contactAspiraLink;
        newContactList[1].email = contactAspiraEmail;
        newContactList[1].phone = contactAspiraPhone;
        newContactList[1].workingHours = aspiraWorkingHours;
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
