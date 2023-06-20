const BaseContract = {
    function: {
        biometric_enabled: false,
    },

    strings: {
        hf_pg_my_lic: "My Licenses",
        my_draw_summary: "My Draw Summary",
        my_draw_applications: "My Draw Applications",
        rule_regulations: "Rules and Regulations",
        usefulLink: "Useful Links",
        hunt_fish_other_info_title: "Other Information",
        hunt_fish_donging_title: "What are you doing today?",
        hunt_fish_harvest_report_title: "Harvest Reports",
        hunt_fish_harvest_report_description: "Submit or view reports",
        hunt_fish_purchase_title: "Purchase License",

        hunt_page_title: "Hunting",
        huntPurchaseDescription: "Purchase or renew hunting licenses",
        hunt_page_description: "View rules and regulations, submit harvest reports, and view your licenses from here.",

        fish_page_title: "Fishing",
        fishPurchaseDescription: "Purchase or renew fishing licenses",
        fish_page_description: "View licenses, rules and regulations, and other important information here.",
    },
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
    },
};

export default BaseContract;
