import request from "./AxiosClient";

const LOCAL_RESOURCE = "owp-webclient/data/intl/locales/en-US.json";

export async function getConfig1() {
    const result = await request(LOCAL_RESOURCE);
    console.log(result);
}

export async function getConfig2() {
    const result = await request("https://postman-echo.com/get");
    console.log(result);
}
