/* eslint-disable no-underscore-dangle */
import * as SQLite from "expo-sqlite";
import { isEmpty } from "lodash";
import AppContract from "../assets/_default/AppContract";
import { ERROR_CODE } from "../constants/Constants";

const db = SQLite.openDatabase(`${AppContract.contractName}_.db`);

export async function dbCreate() {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS MOBILE_ACCOUNT (ID TEXT PRIMARY KEY NOT NULL, PASSWORD TEXT, PRIMARY_PROFILE_ID TEXT, OTHER_PROFILE_IDS TEXT);"
                );
            },
            () => {
                console.log("CREATE TABLE ERROR!");
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
            },
            () => {
                console.log("DROP TABLE ERROR!");
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
            },
            () => {
                console.log("DELETE TABLE ERROR!");
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

export async function insertMobileAccount(id, password, primaryProfileId, otherProfileIds) {
    const checkResult = await checkMobileAccount(id);
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        if (checkResult.success) {
            if (checkResult.count > 0) {
                result.success = false;
                result.code = ERROR_CODE.SQLITE_CONSTRAINT_UNIQUE;
                resolve(result);
            } else {
                db.transaction(
                    (tx) => {
                        tx.executeSql(
                            "REPLACE INTO MOBILE_ACCOUNT(ID, PASSWORD, PRIMARY_PROFILE_ID, OTHER_PROFILE_IDS) VALUES(?, ?, ?, ?);",
                            [`${id}`, password, `${primaryProfileId}`, otherProfileIds]
                        );
                    },
                    () => {
                        console.log("DB INSERT ERROR!");
                        resolve(result);
                    },
                    () => {
                        console.log("DB INSERT SUCCEED!");
                        result.success = true;
                        resolve(result);
                    }
                );
            }
        }
    });
}

export async function deleteMobileAccount(id) {
    const checkResult = await checkMobileAccount(id);
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        if (checkResult.success) {
            if (checkResult.count > 0) {
                db.transaction(
                    (tx) => {
                        tx.executeSql(`DELETE FROM MOBILE_ACCOUNT WHERE ID=?;`, [`${id}`]);
                    },
                    () => {
                        console.log(`DB DELETE ERROR!`);
                        resolve(result);
                    },
                    () => {
                        console.log("DB DELETE SUCCESS!");
                        result.success = true;
                        resolve(result);
                    }
                );
            }
        }
    });
}

export function updateMobileAccount(id, password, primaryProfileId, otherProfileIds) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(
                    `UPDATE MOBILE_ACCOUNT SET PASSWORD=?, PRIMARY_PROFILE_ID=?, OTHER_PROFILE_IDS=? WHERE ID=?;`,
                    [password, `${primaryProfileId}`, otherProfileIds, `${id}`]
                );
            },
            () => {
                console.log(`DB UPDATE ERROR!`);
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
 * @param {string} password
 */
export function updateMobileAccountPasswordById(id, password) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction(
            (tx) => {
                tx.executeSql(`UPDATE MOBILE_ACCOUNT SET PASSWORD=? WHERE ID=?;`, [password, `${id}`]);
            },
            () => {
                console.log(`DB UPDATE ERROR!`);
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

export function getMobileAccountById(id) {
    return new Promise((resolve) => {
        const upperCaseID = id?.toUpperCase();
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM MOBILE_ACCOUNT WHERE UPPER(ID) = (?);",
                [`${upperCaseID}`],
                (_, { rows }) => {
                    result.success = true;
                    console.log(`rows:${JSON.stringify(rows)}`);
                    if (rows.length > 0) {
                        rows._array.forEach((element) => {
                            const account = {
                                userID: element.ID,
                                password: element.PASSWORD,
                                primaryProfileId: element.PRIMARY_PROFILE_ID,
                                otherProfileIds: isEmpty(element.OTHER_PROFILE_IDS)
                                    ? []
                                    : element.OTHER_PROFILE_IDS?.split(","),
                            };
                            result.account = account;
                        });
                        resolve(result);
                    } else {
                        console.log("NO RESULT FOUND!");
                        result.account = null;
                        resolve(result);
                    }
                },
                () => {
                    console.log("DB QUERY ERROR!");
                    resolve(result);
                }
            );
        });
    });
}

/**
 * @param {string} id
 */
export function checkMobileAccount(id) {
    return new Promise((resolve) => {
        const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT COUNT(*) FROM MOBILE_ACCOUNT WHERE ID = (?);",
                [`${id}`],
                (_, { rows }) => {
                    console.log("DB QUERY SUCCESS!");
                    result.success = true;
                    result.count = rows._array[0]["COUNT(*)"];
                    resolve(result);
                },
                () => {
                    console.log("DB QUERY ERROR!");
                    resolve(result);
                }
            );
        });
    });
}
