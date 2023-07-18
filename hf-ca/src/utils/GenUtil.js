/* eslint-disable import/prefer-default-export */
import moment from "moment";
import { isEmpty, isEqual } from "lodash";
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

// "Ethan Li" or "Li,Ethan" -> "EL"
export function shortName(fullName) {
    if (isEmpty(fullName)) {
        return "";
    }
    let shortNameStr = fullName.charAt(0);
    let names = fullName.split(",");
    if (names.length >= 2) {
        shortNameStr = `${names[names.length - 1].charAt(0)}${names[0].charAt(0)}`;
    } else {
        names = fullName.split(" ");
        if (names.length >= 2) {
            shortNameStr = `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
        }
    }
    return shortNameStr.toUpperCase();
}

export function isPDFUrl(url) {
    let result = false;
    if (!url) {
        return result;
    }
    const lowCaseUrl = url.toLowerCase();
    if (lowCaseUrl.endsWith(".pdf")) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

export function getDownloadFileName(url) {
    if (isEmpty(url)) {
        return "_";
    }
    let fileName = url
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9.]/gi, "");
    if (fileName.length > 100) {
        fileName = fileName.substring(fileName.length - 100);
    }
    return fileName;
}
