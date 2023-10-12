import { faHouse } from "@fortawesome/pro-light-svg-icons/faHouse";
import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { faIdCard } from "@fortawesome/pro-light-svg-icons/faIdCard";
import { faHouse as faHouseSolid } from "@fortawesome/pro-solid-svg-icons/faHouse";
import { faUser as faUserSolid } from "@fortawesome/pro-solid-svg-icons/faUser";
import { faIdCard as faIdCardSolid } from "@fortawesome/pro-solid-svg-icons/faIdCard";
import i18n from "../localization/i18n";

const tabIcons = [
    {
        label: i18n.t("tabBar.tabHome"),
        id: "home",
        selected: faHouseSolid,
        unselected: faHouse,
    },
    {
        label: i18n.t("tabBar.tabLicenses"),
        id: "license",
        selected: faIdCardSolid,
        unselected: faIdCard,
    },
    {
        label: i18n.t("tabBar.tabMe"),
        id: "me",
        selected: faUserSolid,
        unselected: faUser,
    },
];

export default tabIcons;
