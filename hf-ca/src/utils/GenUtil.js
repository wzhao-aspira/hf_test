/* eslint-disable import/prefer-default-export */

import { isEqual } from "lodash";

export function sum(a, b) {
    return a + b;
}

export function isJpgFormat(value) {
    return isEqual(value, "image/jpeg") || isEqual(value, "image/jpg");
}
