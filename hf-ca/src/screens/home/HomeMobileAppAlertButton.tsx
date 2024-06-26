import { useSelector } from "react-redux";
import { selectMobileAppAlertUnreadCount } from "../../redux/MobileAppAlertSelector";
import NavigationService from "../../navigation/NavigationService";
import { StyleSheet, View } from "react-native";

import Routers from "../../constants/Routers";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { useEffect, useState } from "react";
import { appConfig } from "../../services/AppConfigService";
import { SelectDialog } from "../../components/Dialog";
import { selectNeedForceUpdate } from "../../redux/AppSlice";
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
    const needForceUpdate = useSelector(selectNeedForceUpdate);

    const { t } = useTranslation();
    const [dialogShown, setDialogShown] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const dialogMessage = appConfig.data.unreadAlertMessage.replace(
        /{{UnreadCount}}/gi,
        mobileAppAlertUnreadCount.toString()
    );
    const dialogShouldShow = !needForceUpdate;

    useEffect(() => {
        if (mobileAppAlertUnreadCount > 0 && !dialogShown) {
            setDialogVisible(true);
            setDialogShown(true);
        }
    }, [mobileAppAlertUnreadCount, dialogShown]);
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

            <SelectDialog
                testID={genTestId("unreadAlertDialog")}
                title={t("mobileAlerts.dialogTitle")}
                message={dialogMessage}
                okText={t("mobileAlerts.dialogOKText")}
                cancelText={t("mobileAlerts.dialogCancelText")}
                okAction={() => {
                    navigateToMobileAppAlert();
                    setDialogVisible(false);
                }}
                cancelAction={() => {
                    setDialogVisible(false);
                }}
                visible={dialogVisible && dialogShouldShow}
                horizontalCTA={false}
            />
        </View>
    );
}
