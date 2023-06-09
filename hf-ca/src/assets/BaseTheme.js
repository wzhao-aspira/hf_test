import color from "color";

const shadow = "#1C2831";
const primary2 = "#324755";

export default {
    colors: {
        black: "#000000",
        transparent: "transparent",
        primary: "#00509D", // Primary_700
        primary_600: "#006CD4",
        primary_800: "#00417F",
        primary_900: "#003160",
        primary_2: primary2, // Secondary_700
        secondary_600: "#485F6E",
        secondary_800: "#1E3645",
        secondary_900: "#102736",
        hunting_green: "#294836",
        fishing_blue: "#00386F",
        camping_brown: "#794F00",
        page_bg: "#F0F3F4",
        border_bg: "#dddddd",
        body_50: "#F7F7F7",
        body_100: "#D9D9D9",
        font_color_1: "#1B1C20", // Body_900
        font_color_2: "#424242", // Body_700
        font_color_3: "#666666", // Body_600
        font_color_4: "#ffffff",
        error: "#C00D1E", // Error_700
        error_600: "#E22B3C",
        error_800: "#9D000F",
        error_900: "#76000B",
        success: "#19964E", // Success_700
        success_600: "#37A266",
        success_800: "#0C773B",
        success_900: "#005B28",
        disclaimer_border: "#FFB951",
        disclaimer_bg: "#FFF1DB",
        shadow,
        quick_action_shadow: shadow,
        backdrop: color("#000000").alpha(0.6).rgb().string(),
        backdrop_light: color("#000000").alpha(0.2).toString(),

        selectBarBg: "#E4E7E8",
        divider: color(primary2).alpha(0.2).rgb().string(),
        indicator: "#00509D",
        question_date_picker_disable_color: "#ABABAD",
    },

    typography: {
        // lato font
        // https://fonts.google.com/specimen/Lato
        primary_heading: {
            fontFamily: "Lato_Bold",
            fontSize: 30,
        },
        secondary_heading: {
            fontFamily: "Lato_Bold",
            fontSize: 20,
        },
        section_header: {
            fontFamily: "Lato_Bold",
            fontSize: 18,
        },

        // roboto font
        // https://fonts.google.com/specimen/Roboto
        temperature: {
            fontFamily: "Bold",
            fontSize: 30,
        },
        sub_text: {
            fontFamily: "Regular",
            fontSize: 18,
        },
        temperature_switch: {
            fontFamily: "Bold",
            fontSize: 16,
        },
        card_title: {
            fontFamily: "Medium",
            fontSize: 16,
        },
        sub_section: {
            fontFamily: "Regular",
            fontSize: 16,
        },
        overlay_hyperLink: {
            fontFamily: "Bold",
            fontSize: 14,
        },
        button_text: {
            fontFamily: "Medium",
            fontSize: 14,
        },
        overlay_sub_text: {
            fontFamily: "Regular",
            fontSize: 14,
        },
        hyperLink: {
            fontFamily: "Bold",
            fontSize: 12,
        },
        card_small_m: {
            fontFamily: "Medium",
            fontSize: 12,
        },
        card_small_r: {
            fontFamily: "Regular",
            fontSize: 12,
        },
        am_pm: {
            fontFamily: "Bold",
            fontSize: 10,
        },
    },

    shadow: {
        shadowColor: shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },

    statusBarStyle: "dark",
};
