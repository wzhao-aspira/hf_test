/* eslint-disable global-require */
/* eslint-disable no-undef */

import { isJpgFormat, sum } from "../../src/utils/GenUtil";

describe("GenUtil", () => {
    test("sum", () => {
        const value = sum(1, 2);
        expect(value).toBe(3);
    });

    test("isJpgFormat", () => {
        expect(isJpgFormat("image/jpeg")).toBe(true);
        expect(isJpgFormat("image/jpg")).toBe(true);
        expect(isJpgFormat("image/png")).toBe(false);
    });
});
