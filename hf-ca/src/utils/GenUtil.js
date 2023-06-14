/* eslint-disable import/prefer-default-export */
import moment from "moment";
import { isEqual } from "lodash";
import { AUTO_REFRESH_TIMEOUT } from "../constants/Constants";

export function sum(a, b) {
    return a + b;
}

export function isJpgFormat(value) {
    return isEqual(value, "image/jpeg") || isEqual(value, "image/jpg");
}

export function checkNeedAutoRefreshData(updateTime) {
    let result = false;

    if (updateTime) {
        const duration = moment().unix() - updateTime;
        console.log(`duration:${duration}`);
        if (duration > AUTO_REFRESH_TIMEOUT) {
            result = true;
        }
    } else {
        result = true;
    }

    return result;
}
