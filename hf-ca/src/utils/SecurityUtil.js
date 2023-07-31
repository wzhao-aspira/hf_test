import { isEmpty } from "lodash";
import XORCipher from "../external/XORCipher";

const xorSecretKey = "AspiraHF";

function safeParse(input) {
    let res;
    try {
        res = JSON.parse(decrypt(input, true));
    } catch (e) {
        console.log("parse error, will try direct parse");
    }
    if (!res) {
        try {
            res = JSON.parse(input);
            console.log("direct parse success");
        } catch (e) {
            console.log("direct parse failed");
        }
    }
    if (!res) {
        // should not happen
        console.log(`can not parse broken json: ${input}`);
    }
    return res || {};
}

function encrypt(input) {
    return XORCipher.encode(xorSecretKey, input);
}

function decrypt(input) {
    if (isEmpty(input)) {
        return input;
    }

    const result = XORCipher.decode(xorSecretKey, input);
    return result;
}

function xorEncrypt(input) {
    return XORCipher.encode(xorSecretKey, input);
}

function xorDecrypt(input) {
    return XORCipher.decode(xorSecretKey, input);
}

export default {
    decrypt,
    encrypt,
    safeParse,
    xorEncrypt,
    xorDecrypt,
};
