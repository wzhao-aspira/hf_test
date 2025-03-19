import { getCacheRegulations, markDownloadAsFinishedByID } from "../services/RegulationService";
import NavigationService, { navigationRef } from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import notifee, { EventType } from "@notifee/react-native";
import { retrieveItem } from "./StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

export function registerNotifeeEvent() {
    notifee.onForegroundEvent(async ({ type, detail }) => {
        console.log("open notifee on Foreground");
        notifeePressEvent(type, detail);
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        console.log("open notifee on Background");
        notifeePressEvent(type, detail);
    });
}

async function notifeePressEvent(pressType, detail) {
    const navigationState = navigationRef?.current?.getState();
    if (!navigationState) {
        return;
    }

    const versionResult = await retrieveItem(KEY_CONSTANT.keyVersionInfo);
    if (!!versionResult && versionResult.updateOption === 2) {
        return;
    }

    if (pressType === EventType.PRESS) {
        const data = detail.notification.data;
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
};




