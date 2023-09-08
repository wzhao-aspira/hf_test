/* eslint-disable import/no-mutable-exports */
import Realm from "realm";
import AppContract from "../assets/_default/AppContract";
import ProfileSummary from "./models/ProfileSummary";
import ProfileDetail from "./models/ProfileDetail";

const schemaVersion = 1;

export let realm: Realm;

export async function openRealm() {
    realm = await Realm.open({
        schema: [ProfileSummary, ProfileDetail],
        path: `${AppContract.contractName}.realm`,
        schemaVersion,
        deleteRealmIfMigrationNeeded: !!__DEV__,
        // onMigration: (oldRealm, newRealm) => {
        //     if (oldRealm.schemaVersion < 2) {
        //         // Migration
        //     }
        // },
    });
}

export function closeRealm() {
    realm?.close();
}
