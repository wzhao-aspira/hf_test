import AppContract from "../assets/_default/AppContract";
import { appConfig } from "./AppConfigService";

import type { i18n, TFunction } from "i18next";
import type { Contact, Social } from "../assets/_default/AppContract";

export const getListData = (
    i18n: i18n,
    t: TFunction<"translation", undefined, "translation">,
    list: Contact[] | Social[] = []
) => {
    const data = list?.map((item) => {
        const title = i18n.exists(`contact.${item.titleKey}`) ? t(`contact.${item.titleKey}`) : item.titleKey;
        return { ...item, title };
    });
    return data;
};

export function getContactUsLinks(i18n: i18n, t: TFunction<"translation", undefined, "translation">) {
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

export function getSocialLinks(i18n: i18n, t: TFunction<"translation", undefined, "translation">) {
    const newSocialList = AppContract.socialList;
    const tempSocialList: { titleKey: string; url: string }[] = [];
    const { facebookLink, twitterLink, youTubeLink, instagramLink, linkedinLink } = appConfig.data;
    if (facebookLink) {
        newSocialList[0].url = facebookLink;
        tempSocialList.push(newSocialList[0]);
    }
    if (twitterLink) {
        newSocialList[1].url = twitterLink;
        tempSocialList.push(newSocialList[1]);
    }
    if (youTubeLink) {
        newSocialList[2].url = youTubeLink;
        tempSocialList.push(newSocialList[2]);
    }
    if (instagramLink) {
        newSocialList[3].url = instagramLink;
        tempSocialList.push(newSocialList[3]);
    }
    if (linkedinLink) {
        newSocialList[4].url = linkedinLink;
        tempSocialList.push(newSocialList[4]);
    }
    return getListData(i18n, t, tempSocialList);
}

export function showSocialLinksMenu() {
    const { facebookLink, twitterLink, youTubeLink, instagramLink, linkedinLink } = appConfig.data;
    return facebookLink || twitterLink || youTubeLink || instagramLink || linkedinLink;
}
