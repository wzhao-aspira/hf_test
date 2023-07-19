const BaseContract = {
    function: {
        biometric_enabled: true,
    },

    strings: {},
    dateFormats: {
        hh_ss_am_pm: "HH:ss A",
        h_ss: "h:ss",
        am_pm: "A",
        dddd: "dddd",
    },
    inputFormat: {
        fmt_1: "YYYY-MM-DD HH:mm",
        fmt_2: "YYYY-MM-DD",
        fmt_3: "YYYY-MM-DDTHH:mm:ss", // 2021-08-03T17:03:52
        fmt_4: "YYYY-MM-DD HH:mm:ss",
    },
    outputFormat: {
        fmt_1: "MMM DD, YYYY",
        fmt_2: "MM/DD/YYYY",
        fmt_3: "MMM DD, YYYY, h:mm A",
    },
    weather: {
        apiKey: "1423c70493d248528de23809211305",
        defaultCityName: "Sacramento",
        defaultCityGps: [-121.4944, 38.5816],
    },
};

export default BaseContract;
