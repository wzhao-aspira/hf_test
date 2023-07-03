/* eslint-disable no-undef */
import SecurityUtil from "../../src/utils/SecurityUtil";

describe("SecurityUtil test", () => {
    test("xorEncrypt-xorDecrypt", () => {
        const original = "hello world";
        const encrypt = SecurityUtil.xorEncrypt(original);
        expect(encrypt).not.toBe(original);

        const decrypt = SecurityUtil.xorDecrypt(encrypt);

        expect(decrypt).toBe(original);
    });
});
