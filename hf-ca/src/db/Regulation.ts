import Realm from "realm";
import { realm } from "./ConfigRealm";
import Regulation from "./models/Regulation";

export function getAllRegulations() {
    try {
        const regulations = realm.objects(Regulation);
        return regulations.toJSON();
    } catch (error) {
        console.error('Error querying all regulations:', error);
        return [];
    }
};

export function updateRegulationStatus(regulationIds: Array<string>, status: number) {
    try {
        realm.write(() => {
            regulationIds.forEach((id) => {
                const regulation = realm.objectForPrimaryKey(Regulation, id);
                if (regulation) {
                    regulation.regulationStatus = status;
                }
            });
        });
        console.log(`Update regulations ${regulationIds} stauts = ${status}.`);
    } catch (error) {
        console.error('Error updating regulation status:', error);
    }
};

export function saveRegulationDownloadInfo(regulation) {
    try {
        realm.write(() => {
            realm.create(Regulation, regulation, Realm.UpdateMode.Modified);
        });
        console.log('save regulation download info completed.', regulation.regulationId);
    } catch (error) {
        console.error('Error upserting regulation:', error);
    }
};

export function getRegulationById(id: string) {
    try {
        const regulation = realm.objectForPrimaryKey(Regulation, id);
        return regulation || null;
    } catch (error) {
        console.error('Error querying regulation by id:', error);
        return null;
    }
};

export function deleteRegulationById(id: string) {
    const regulation = getRegulationById(id);
    if (!!regulation) {
        realm.write(() => {
            realm.delete(regulation);
        });
    }
};