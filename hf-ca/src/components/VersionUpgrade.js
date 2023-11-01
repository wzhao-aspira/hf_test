import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { BackHandler } from "react-native";
import { openAppStore } from "../helper/AppHelper";
import NavigationService from "../navigation/NavigationService";
import { SelectDialogView, SimpleDialogView } from "./Dialog";

export const UpgradeDialog = {
    show: false,
};

export default function VersionUpgrade(props) {
    const { optionalUpdate, forceUpdate, message, url, onCancel } = props;
    const { t } = useTranslation();

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription?.remove();
        }, [])
    );

    if (forceUpdate) {
        return (
            <SimpleDialogView
                title={t("versionUpgrade.newVersionAvailable")}
                message={message}
                okText={t("versionUpgrade.btnUpdate")}
                okAction={() => {
                    openAppStore(url);
                }}
                visible={forceUpdate}
                messageStyle={{ textAlign: "left" }}
            />
        );
    }

    return (
        <SelectDialogView
            messageStyle={{ textAlign: "left" }}
            title={t("versionUpgrade.newVersionAvailable")}
            message={message}
            okText={t("versionUpgrade.btnUpdate")}
            cancelText={t("versionUpgrade.btnCancel")}
            okAction={() => {
                openAppStore(url);
                UpgradeDialog.show = false;
                NavigationService.back();
            }}
            cancelAction={() => {
                UpgradeDialog.show = false;
                onCancel?.();
                NavigationService.back();
            }}
            visible={optionalUpdate}
            horizontalCTA
        />
    );
}
