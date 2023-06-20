/* eslint-disable no-undef */
import DateUtils from "../../src/utils/DateUtils";
import AppContract from "../../src/assets/_default/AppContract";

const testTime = 1641031200000; // 2022-01-01 18:00:00 beijing time
const testTimeString = "2022-01-01 00:00";
const testObject = {
    year: 2022,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
};

const testConfigsUS = [
    {
        format: AppContract.outputFormat.fmt_1,
        result: "Jan 01, 2022",
        description: "format: MMM DD, YYYY",
    },
    {
        format: AppContract.outputFormat.fmt_2,
        result: "01/01/2022",
        description: "format: MM/DD/YYYY",
    },
];

const testConfigsCA = [
    {
        format: AppContract.outputFormat.fmt_1,
        result: "2022, Jan 01",
        description: "format: YYYY, MMM DD",
    },
    {
        format: AppContract.outputFormat.fmt_2,
        result: "2022/01/01",
        description: "format: YYYY/MM/DD",
    },
];

if (AppContract.divisionCountry === "US") {
    describe("Date object format on US", () => {
        const date = new Date(testTime);
        testConfigsUS.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(date, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Date string format on US", () => {
        testConfigsUS.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(testTimeString, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Date stamp format on US", () => {
        testConfigsUS.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(testTime, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Object format on US", () => {
        testConfigsUS.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateObjectToFormat(testObject, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Special date object from A1", () => {
        const date1 = { year: 1, month: 2, day: 2 };
        test("error year of day object", () => {
            const res = DateUtils.dateObjectToFormat(date1, AppContract.outputFormat.fmt_2);
            expect(res).toBe("02/02/0001");
        });

        const date2 = { year: 1, month: 2, day: 2, hour: 12, minute: 10 };
        test("error year of minute object", () => {
            const res = DateUtils.dateObjectToFormat(date2, AppContract.outputFormat.fmt_2);
            expect(res).toBe("02/02/0001");
        });
    });

    describe("Input format with strict mode on US", () => {
        test("input format is mismatch", () => {
            const res = DateUtils.dateToFormat(
                "2022-02",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                true
            );
            expect(res).toBe("-");
        });
        test("input format is match with date", () => {
            const res = DateUtils.dateToFormat(
                "2022-02-02 12:12",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                true
            );
            expect(res).toBe("02/02/2022");
        });
        test("input format is mismatch but without strict", () => {
            const res = DateUtils.dateToFormat(
                "2022-02-02",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                false
            );
            expect(res).toBe("02/02/2022");
        });
    });
} else if (AppContract.divisionCountry === "CA") {
    describe("Date object format on CA", () => {
        const date = new Date(testTime);
        testConfigsCA.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(date, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Date string format on CA", () => {
        testConfigsCA.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(testTimeString, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Date stamp format on CA", () => {
        testConfigsCA.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateToFormat(testTime, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Object format on CA", () => {
        testConfigsCA.forEach((config) => {
            test(config.description, () => {
                const res = DateUtils.dateObjectToFormat(testObject, config.format);
                expect(res).toBe(config.result);
            });
        });
    });

    describe("Special date object from A1", () => {
        const date1 = { year: 1, month: 2, day: 2 };
        test("error year of day object", () => {
            const res = DateUtils.dateObjectToFormat(date1, AppContract.outputFormat.fmt_2);
            expect(res).toBe("0001/02/02");
        });

        const date2 = { year: 1, month: 2, day: 2, hour: 12, minute: 10 };
        test("error year of minute object", () => {
            const res = DateUtils.dateObjectToFormat(date2, AppContract.outputFormat.fmt_2);
            expect(res).toBe("0001/02/02");
        });
    });

    describe("Input format with strict mode on CA", () => {
        test("input format is mismatch", () => {
            const res = DateUtils.dateToFormat(
                "2022-02",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                true
            );
            expect(res).toBe("-");
        });
        test("input format is match with date", () => {
            const res = DateUtils.dateToFormat(
                "2022-02-02 12:12",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                true
            );
            expect(res).toBe("2022/02/02");
        });
        test("input format is mismatch but without strict", () => {
            const res = DateUtils.dateToFormat(
                "2022-02-02",
                AppContract.outputFormat.fmt_2,
                AppContract.inputFormat.fmt_1,
                false
            );
            expect(res).toBe("2022/02/02");
        });
    });
}
