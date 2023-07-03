import XORCipher from "../external/XORCipher";

const xorSecretKey = "AspiraHF";

function xorEncrypt(input) {
    return XORCipher.encode(xorSecretKey, input);
}

function xorDecrypt(input) {
    return XORCipher.decode(xorSecretKey, input);
}

export default {
    xorEncrypt,
    xorDecrypt,
};
