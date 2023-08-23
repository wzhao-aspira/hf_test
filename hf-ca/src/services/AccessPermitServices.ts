import accessPermitData from "./mock_data/access_permit.json";
import { AccessPermitItem, AccessPermit } from "../types/accessPermit";

const convertAccessPermitItem = (activePermit): AccessPermitItem => {
    const { applicationYear, masterHuntTypeName, masterHuntTypeId, huntDays } = activePermit;
    const id = applicationYear + masterHuntTypeId;
    const name = `${applicationYear} ${masterHuntTypeName}`;
    const activePermitHuntDays = huntDays.map((item) => {
        const { huntCode, huntName, huntDay } = item;
        return { huntCode, huntName, huntDay };
    });

    return { id, name, huntDays: activePermitHuntDays };
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
