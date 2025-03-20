import { getCacheRegulations, markDownloadAsFinishedByID } from "../services/RegulationService";
import NavigationService, { navigationRef } from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import notifee, { EventType } from "@notifee/react-native";
import { retrieveItem } from "./StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

export function registerNotifeeEvent() {
    notifee.onForegroundEvent(async ({ type, detail }) => {
        console.log("open notifee on Foreground");
        if (type === EventType.PRESS) {
            handleNotificationPress(detail.notification);
        }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        console.log("open notifee on Background");
        if (type === EventType.PRESS) {
            handleNotificationPress(detail.notification);
        }
    });

    notifee.getInitialNotification().then(notification => {
        if (notification) {
            handleNotificationPress(notification);
        }
    });
}

async function handleNotificationPress(notification) {
    try {
        const versionResult = await retrieveItem(KEY_CONSTANT.keyVersionInfo);
        if (!!versionResult && versionResult.updateOption === 2) {
            return;
        }

        const data = notification.data;
        if (data.type === "VIEW_REGULATION" && !!data.id) {
            const cacheRegulation = await getCacheRegulations();
            if (cacheRegulation && cacheRegulation.regulationList) {
                const regulation = cacheRegulation.regulationList.find((n) => n.regulationId == data.id);
                if (regulation) {
                    markDownloadAsFinishedByID(data.id);
                    NavigationService.navigate(Routers.regulationDetail, { regulation: regulation });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};




