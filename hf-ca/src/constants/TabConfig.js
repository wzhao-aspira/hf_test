import AppTheme from "../assets/_default/AppTheme";
import { pathList } from "../components/SVGIcon";
import i18n from "../localization/i18n";

export const tabHome = {
    name: pathList.home,
    viewBox: "0 0 22 19",
    height: 18.67,
    color: AppTheme.colors.primary_2,
    label: i18n.t("tabBar.tabHome"),
};

export const tabHunting = {
    name: pathList.hunting,
    viewBox: "0 0 18 19",
    height: 19.11,
    color: AppTheme.colors.primary_2,
    label: i18n.t("tabBar.tabHunting"),
};

export const tabFishing = {
    name: pathList.fishing,
    viewBox: "0 0 25 15",
    height: 14.67,
    color: AppTheme.colors.primary_2,
    label: i18n.t("tabBar.tabFishing"),
};

export const tabIcons = [tabHome, tabHunting, tabFishing];

export const tabSelIcons = [
    { ...tabHome, name: pathList.homeSel, viewBox: "0 0 25 19" },
    { ...tabHunting, name: pathList.huntingSel, viewBox: "0 0 19 19" },
    { ...tabFishing, name: pathList.fishingSel },
];
