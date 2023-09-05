/* eslint-disable no-underscore-dangle */
import * as SQLite from "expo-sqlite";
import { isEmpty } from "lodash";
import AppContract from "../assets/_default/AppContract";
import { ERROR_CODE } from "../constants/Constants";
import SecurityUtil from "../utils/SecurityUtil";

const db = SQLite.openDatabase(`${AppContract.contractName}_.db`);

export async function dbCreate() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS MOBILE_ACCOUNT (ID TEXT PRIMARY KEY NOT NULL, PASSWORD TEXT, PRIMARY_PROFILE_ID TEXT, OTHER_PROFILE_IDS TEXT);"
                );
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS PROFILE_LIST (PROFILE_ID TEXT PRIMARY KEY NOT NULL, SUMMARY TEXT, DETAIL TEXT);"
                );
            },
            (error) => {
                console.log(`CREATE TABLE ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("CREATE TABLE SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

export async function dbDrop() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql("DROP TABLE IF EXISTS MOBILE_ACCOUNT;");
                tx.executeSql("DROP TABLE IF EXISTS PROFILE_LIST;");
            },
            (error) => {
                console.log(`DROP TABLE ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("DROP TABLE SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

export async function dbClear() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql("DELETE FROM MOBILE_ACCOUNT;");
                tx.executeSql("DELETE FROM PROFILE_LIST;");
            },
            (error) => {
                console.log(`DELETE TABLE ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("DELETE TABLE SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

export async function getProfileListFromDB() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM PROFILE_LIST;",
                null,
                (_, { rows }) => {
                    result.success = true;
                    console.log(`profile list rows:${JSON.stringify(rows)}`);
                    if (rows.length > 0) {
                        result.profileList = rows._array.map((item) => {
                            const summary = item.SUMMARY;
                            const profile = SecurityUtil.safeParse(summary);
                            return profile;
                        });
                        resolve(result);
                    } else {
                        console.log("NO RESULT FOUND!");
                        result.profileList = null;
                        resolve(result);
                    }
                },
                (error) => {
                    console.log(`DB QUERY ERROR! - ${JSON.stringify(error)}`);
                    resolve(result);
                }
            );
        });
    });
}

export async function updateProfileListToDB(profileList) {
    console.log(`profile list:${JSON.stringify(profileList)}`);
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };

        let sqlSentence = "REPLACE INTO PROFILE_LIST (PROFILE_ID, SUMMARY) VALUES";
        const values = [];
        for (let index = 0; index < profileList.length; index++) {
            const profile = profileList[index];
            if (index == profileList.length - 1) {
                sqlSentence += " (?, ?);";
            } else {
                sqlSentence += " (?, ?),";
            }

            values.push(`${profile.customerId}`);
            values.push(`${SecurityUtil.encrypt(JSON.stringify(profile))}`);
        }

        console.log(`sql:${sqlSentence}`);
        console.log(`values:${values}`);

        db.transaction(
            (tx) => {
                tx.executeSql(sqlSentence, values);
            },
            (error) => {
                console.log(`DB INSERT ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("DB INSERT SUCCEED!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

export async function updateProfileDetailToDB(profile) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(`UPDATE PROFILE_LIST SET DETAIL=? WHERE PROFILE_ID=?;`, [
                    `${SecurityUtil.encrypt(JSON.stringify(profile))}`,
                    `${profile.customerId}`,
                ]);
            },
            (error) => {
                console.log(`updateProfileDetailToDB ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("updateProfileDetailToDB SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

export async function getProfileDetailFromDB(profileId) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM PROFILE_LIST WHERE PROFILE_ID=?;",
                [`${profileId}`],

                (_, { rows }) => {
                    console.log(`getProfileDetailFromDB SUCCESS - :${JSON.stringify(rows)}`);
                    result.success = true;
                    if (rows._array?.length > 0) {
                        const detail = rows._array[0].DETAIL;
                        result.profile = SecurityUtil.safeParse(detail);
                        resolve(result);
                    } else {
                        result.profile = null;
                        resolve(result);
                    }
                },
                (error) => {
                    console.log(`getProfileDetailFromDB QUERY ERROR! - ${JSON.stringify(error)}`);
                    resolve(result);
                }
            );
        });
    });
}

export async function clearProfileListFromDB() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql("DELETE FROM PROFILE_LIST;");
            },
            (error) => {
                console.log(`DELETE TABLE ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("DELETE TABLE SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

/**
 * @param {string} id
 * @param {string} password
 */
export function updateMobileAccountPasswordById(id, password) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(`UPDATE MOBILE_ACCOUNT SET PASSWORD=? WHERE ID=?;`, [password, `${id}`]);
            },
            (error) => {
                console.log(`DB UPDATE ERROR! - ${JSON.stringify(error)}`);
                resolve(result);
            },
            () => {
                console.log("DB UPDATE SUCCESS!");
                result.success = true;
                resolve(result);
            }
        );
    });
}

/**
 * @param {string} id
 */
export async function checkMobileAccount(id) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        if (isEmpty(id)) {
            console.log("ID IS REQUIRED!");
            result.account = null;
            resolve(result);
            return;
        }
        const upperCaseID = id.toUpperCase();
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT COUNT(*) FROM MOBILE_ACCOUNT WHERE UPPER(ID) = (?);",
                [`${upperCaseID}`],
                (_, { rows }) => {
                    console.log("DB QUERY SUCCESS!");
                    result.success = true;
                    result.count = rows._array[0]["COUNT(*)"];
                    resolve(result);
                },
                (error) => {
                    console.log(`DB QUERY ERROR! - ${JSON.stringify(error)}`);
                    resolve(result);
                }
            );
        });
    });
}
