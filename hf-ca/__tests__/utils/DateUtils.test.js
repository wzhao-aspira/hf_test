/* eslint-disable no-undef */
import DateUtils from "../../src/utils/DateUtils";
import AppContract from "../../src/assets/_default/AppContract";

describe("Test dateToFormat", () => {
    const testTime = 1641031200000; // 2022-01-01 18:00:00 beijing time
    test("input is a Date without format", () => {
        const expectResult = "Jan 01, 2022";
        const date = new Date(testTime);
        const res = DateUtils.dateToFormat(date);
        expect(res).toBe(expectResult);
    });

    test("input is a Date with format MMM DD, YYYY", () => {
        const expectResult = "Jan 01, 2022";
        const format = AppContract.outputFormat.fmt_1;
        const date = new Date(testTime);
        const res = DateUtils.dateToFormat(date, format);
        expect(res).toBe(expectResult);
    });

    test("input is a Date with format MM/DD/YYYY", () => {
        const expectResult = "01/01/2022";
        const format = AppContract.outputFormat.fmt_2;
        const date = new Date(testTime);
        const res = DateUtils.dateToFormat(date, format);
        expect(res).toBe(expectResult);
    });

    test("input is a string", () => {
        const expectResult = "01/01/2022";
        const format = AppContract.outputFormat.fmt_2;
        const testTimeString = "2022-01-01 00:00";
        const res = DateUtils.dateToFormat(testTimeString, format);
        expect(res).toBe(expectResult);
    });

    test("input is a timestamp", () => {
        const expectResult = "01/01/2022";
        const format = AppContract.outputFormat.fmt_2;
        const res = DateUtils.dateToFormat(testTime, format);
        expect(res).toBe(expectResult);
    });

    test("fmtTo format is invalid", () => {
        const expectResult = "-";
        const format = "DD YYY";
        const date = new Date(testTime);
        const res = DateUtils.dateToFormat(date, format);
        expect(res).toBe(expectResult);
    });

    test("inputFmt is invalid", () => {
        const expectResult = "-";
        const format = AppContract.outputFormat.fmt_2;
        const inputFmt = "DD YYY";
        const date = new Date(testTime);
        const res = DateUtils.dateToFormat(date, format, inputFmt);
        expect(res).toBe(expectResult);
    });

    test("input is invalid", () => {
        const expectResult = "-";
        const input = "2022-13-13";
        const res = DateUtils.dateToFormat(input);
        expect(res).toBe(expectResult);
    });
});

describe("Test dateObjectToFormat", () => {
    test("object is empty", () => {
        const expectResult = "-";
        const res = DateUtils.dateObjectToFormat({});
        expect(res).toBe(expectResult);
    });

    test("object without hour, minute", () => {
        const expectResult = "Jan 01, 2022";
        const testObject = {
            year: 2022,
            month: 1,
            day: 1,
        };

        const res = DateUtils.dateObjectToFormat(testObject);
        expect(res).toBe(expectResult);
    });

    test("object without hour, minute, day", () => {
        const expectResult = "-";
        const testObject = {
            year: 2022,
            month: 1,
        };

        const res = DateUtils.dateObjectToFormat(testObject);
        expect(res).toBe(expectResult);
    });

    test("provide correct object and format", () => {
        const expectResult = "Jan 01, 2022, 10:10 AM";
        const testObject = {
            year: 2022,
            month: 1,
            day: 1,
            hour: 10,
            minute: 10,
        };
        const fmt = AppContract.outputFormat.fmt_3;
        const res = DateUtils.dateObjectToFormat(testObject, fmt);
        expect(res).toBe(expectResult);
    });
});
