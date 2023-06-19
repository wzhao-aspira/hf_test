/* eslint-disable global-require */
/* eslint-disable no-undef */

import { isJpgFormat, sum, checkNeedAutoRefreshData, isBlank, shortName } from "../../src/utils/GenUtil";

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

    test("checkNeedAutoRefreshData", () => {
        expect(checkNeedAutoRefreshData(null)).toBe(true);
        expect(checkNeedAutoRefreshData(1000000)).toBe(true);
    });

    test("isBlank", () => {
        const v1 = isBlank(undefined) || isBlank(null) || isBlank("") || isBlank(" ");
        expect(v1).toBe(true);
    });

    test("shortName", () => {
        const v0 = shortName("");
        const v1 = shortName("Ethan Li");
        const v2 = shortName("ethan li");
        const v3 = shortName("Li,Ethan");
        const v4 = shortName("li,ethan");
        const v5 = shortName("Ethan Middle Li");
        const v6 = shortName("Li,Middle,Ethan");
        expect(v0).toBe("");
        expect(v1).toBe("EL");
        expect(v2).toBe("EL");
        expect(v3).toBe("EL");
        expect(v4).toBe("EL");
        expect(v5).toBe("EL");
        expect(v6).toBe("EL");
    });
});
