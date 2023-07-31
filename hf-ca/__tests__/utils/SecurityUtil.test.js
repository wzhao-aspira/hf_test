/* eslint-disable no-undef */
import SecurityUtil from "../../src/utils/SecurityUtil";

describe("SecurityUtil test", () => {
    test("encrypt", () => {
        const value = SecurityUtil.encrypt("YYYY-MM-DD");
        // GCopMF8sBWsFNw==
        console.log(value);
        expect(value).toBe("GCopMF8sBWsFNw==");
    });

    test("decrypt", () => {
        const value = SecurityUtil.decrypt("GCopMF8sBWsFNw==");
        // YYYY-MM-DD
        console.log(value);
        expect(value).toBe("YYYY-MM-DD");
    });

    test("safeParse", () => {
        const original = {
            id: "110",
            name: "test",
        };
        const encrypted = SecurityUtil.encrypt(JSON.stringify(original));
        const value1 = SecurityUtil.safeParse(encrypted);
        const value2 = SecurityUtil.safeParse(JSON.stringify(original));

        expect(value1).toEqual(original);
        expect(value2).toEqual(original);

        const brokenJSON = "{ id: '110', name: 'test' ";
        const value3 = SecurityUtil.safeParse(brokenJSON);

        expect(value3).toEqual({});

        const value4 = SecurityUtil.safeParse(null);
        expect(value4).toEqual({});

        const value5 = SecurityUtil.safeParse(undefined);
        expect(value5).toEqual({});

        const value6 = SecurityUtil.safeParse("hello");
        expect(value6).toEqual({});

        const value7 = SecurityUtil.safeParse(9);
        expect(value7).toEqual(9);
    });

    test("xorEncrypt-xorDecrypt", () => {
        const original = "hello world";
        const encrypt = SecurityUtil.xorEncrypt(original);
        expect(encrypt).not.toBe(original);

        const decrypt = SecurityUtil.xorDecrypt(encrypt);

        expect(decrypt).toBe(original);
    });
});
