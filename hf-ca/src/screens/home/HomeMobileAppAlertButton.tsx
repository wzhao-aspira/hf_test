import { useSelector } from "react-redux";
import { selectMobileAppAlertUnreadCount } from "../../redux/MobileAppAlertSelector";
import NavigationService from "../../navigation/NavigationService";
import { StyleSheet, View } from "react-native";

import Routers from "../../constants/Routers";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { useDialog } from "../../components/dialog/index";
import { useEffect, useState } from "react";
export const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /**
         * Raynor Chen @ May. 16th 2024
         * Fixed height to reduce Cumulative Layout Shift (CLS).
         */
        height: 100,
    },
});
const navigateToMobileAppAlert = () => {
    NavigationService.navigate(Routers.mobileAlertsList);
};

export type HomeMobileAppALertButtonProps = {
    isLoading: boolean;
};

export function HomeMobileAppAlertButton(props: HomeMobileAppALertButtonProps) {
    const mobileAppAlertUnreadCount = useSelector(selectMobileAppAlertUnreadCount);
    const { t } = useTranslation();
    const { openSelectDialog } = useDialog();
    const [dialogShown, setDialogShown] = useState(false);
    function showUnreadAlertDialog(mobileAppAlertCount: number) {
        setTimeout(() => {
            openSelectDialog({
                title: t("mobileAlerts.dialogTitle"),
                message: t("mobileAlerts.dialogContent", {
                    unreadCount: mobileAppAlertCount,
                }),
                okText: "mobileAlerts.dialogOKText",
                cancelText: "mobileAlerts.dialogCancelText",
                onConfirm: navigateToMobileAppAlert,
            });
        });
    }
    useEffect(() => {
        if (mobileAppAlertUnreadCount > 0 && !dialogShown) {
            showUnreadAlertDialog(mobileAppAlertUnreadCount);
            setDialogShown(true);
        }
    }, [mobileAppAlertUnreadCount]);
    const hasUnreadMobileAppAlert = mobileAppAlertUnreadCount != 0;
    if (!hasUnreadMobileAppAlert) {
        return null;
    }
    const buttonLabel = t("mobileAlerts.viewUnreadCDFWAlerts", {
        unreadAlertCount: mobileAppAlertUnreadCount,
    });
    return (
        <View style={styles.container}>
            <PrimaryBtn
                testID={genTestId("HomeMobileAppAlertButton")}
                style={{ marginHorizontal: DEFAULT_MARGIN, minWidth: 200 }}
                onPress={navigateToMobileAppAlert}
                label={buttonLabel}
                isLoading={props.isLoading}
            />
        </View>
    );
}
