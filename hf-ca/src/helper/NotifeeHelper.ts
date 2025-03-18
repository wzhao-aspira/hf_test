import { getCacheRegulations } from "../services/RegulationService";
import { updateRegulationStatus, getRegulationById } from "../db/Regulation";
import { RegulationUpdateStatus } from '../constants/RegulationUpdateStatus';
import NavigationService, { navigationRef } from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import notifee, { EventType } from "@notifee/react-native";

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

    if (pressType === EventType.PRESS) {
        const data = detail.notification.data;
        if (data.type === "VIEW_REGULATION" && !!data.id) {

            const cacheRegulation = await getCacheRegulations();
            if (cacheRegulation && cacheRegulation.regulationList) {
                const regulation = cacheRegulation.regulationList.find((n) => n.regulationId == data.id);
                if (regulation) {
                    const regulationStatusInfo = getRegulationById(data.id);
                    if (regulationStatusInfo.regulationStatus === RegulationUpdateStatus.AutoUpdateCompleted || regulationStatusInfo.regulationStatus === RegulationUpdateStatus.UpdateNotified) {
                        updateRegulationStatus([data.id], RegulationUpdateStatus.Finished)
                    }
                    NavigationService.navigate(Routers.regulationDetail, { regulation: regulation });
                }
            }
        }
    }
};




