import accessPermitData from "./mock_data/access_permit.json";
import { AccessPermitItem, AccessPermit } from "../types/accessPermit";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";

const formateHuntDay = (huntDay) => {
    return huntDay && DateUtils.dateToFormat(huntDay, AppContract.outputFormat.fmt_1, AppContract.inputFormat.fmt_2);
};

const convertAccessPermitItem = (activePermit): AccessPermitItem => {
    const { applicationYear, masterHuntTypeName, masterHuntTypeId, huntDays } = activePermit;
    const id = applicationYear + masterHuntTypeId;
    const name = `${applicationYear} ${masterHuntTypeName}`;
    const activePermitHuntDays = huntDays
        .map((item) => {
            const { huntCode, huntName, huntDay } = item;
            const huntId = huntDay + huntName;
            const formattedHuntDay = formateHuntDay(huntDay);
            return { id: huntId, huntCode, huntName, huntDay: formattedHuntDay };
        })
        .sort((a, b) => b.id.localeCompare(a.id));

    return { id, name, huntDays: activePermitHuntDays };
};

export const sortHuntDays = (huntDays, ascendingOrder) => {
    if (ascendingOrder) {
        huntDays.sort((a, b) => a.id.localeCompare(b.id));
    } else {
        huntDays.sort((a, b) => b.id.localeCompare(a.id));
    }
    return huntDays;
};

export async function getAccessPermitData(searchParams: { activeProfileId: string }): Promise<AccessPermit> {
    // const { activeProfileId } = searchParams;
    return new Promise((res) => {
        const { instructions, activePermitList } = accessPermitData.result;
        const accessPermits = activePermitList
            .map((item) => {
                return convertAccessPermitItem(item);
            })
            .sort((a, b) => b.name.localeCompare(a.name));
        const data = { attention: instructions, accessPermits };
        setTimeout(() => res(data), 3000);
    });
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
