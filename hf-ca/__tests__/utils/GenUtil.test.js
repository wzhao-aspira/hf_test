/* eslint-disable global-require */
/* eslint-disable no-undef */
import moment from "moment";
import { isJpgFormat, sum, checkNeedAutoRefreshData, shortName } from "../../src/utils/GenUtil";

describe("Test sum", () => {
    test("call sum normally", () => {
        const value = sum(1, 2);
        expect(value).toBe(3);
    });
});

describe("Test isJpgFormat", () => {
    test("jpeg format", () => {
        const value = "image/jpeg";
        const expectResult = true;
        expect(isJpgFormat(value)).toBe(expectResult);
    });

    test("jpg format", () => {
        const value = "image/jpg";
        const expectResult = true;
        expect(isJpgFormat(value)).toBe(expectResult);
    });

    test("png format", () => {
        const value = "image/png";
        const expectResult = false;
        expect(isJpgFormat(value)).toBe(expectResult);
    });
});

describe("Test checkNeedAutoRefreshData", () => {
    test("without updateTime", () => {
        const value = null;
        const expectResult = true;
        expect(checkNeedAutoRefreshData(value)).toBe(expectResult);
    });

    test("updateTime is timeout", () => {
        const value = moment().unix() - 1900;
        const expectResult = true;
        expect(checkNeedAutoRefreshData(value)).toBe(expectResult);
    });

    test("updateTime is not timeout", () => {
        const value = moment().unix();
        const expectResult = false;
        expect(checkNeedAutoRefreshData(value)).toBe(expectResult);
    });
});

describe("Test shortName", () => {
    test("without fullName", () => {
        const value = null;
        const expectResult = "";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });

    test("single fullName", () => {
        const value = "Ethan";
        const expectResult = "E";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });

    test("space separated fullName", () => {
        const value = "Ethan Li";
        const expectResult = "EL";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });

    test("comma separated fullName", () => {
        const value = "Li,Ethan";
        const expectResult = "EL";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });

    test("space separated fullName with middle name", () => {
        const value = "Ethan Middle Li";
        const expectResult = "EL";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });

    test("comma separated fullName with middle name", () => {
        const value = "Li,Middle,Ethan";
        const expectResult = "EL";
        const result = shortName(value);
        expect(result).toBe(expectResult);
    });
});
