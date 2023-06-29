import { StyleSheet } from "react-native";
import { SharedStyles } from "../../styles/CommonStyles";
import AppTheme from "../../assets/_default/AppTheme";

const ForgotPasswordStyles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    attention_label: {
        ...SharedStyles.page_content_title,
        marginTop: 30,
        marginBottom: 15,
    },
    action_button: {
        marginTop: 40,
    },
    tip_message: {
        marginTop: 20,
        color: AppTheme.colors.font_color_3,
    },
});

export default ForgotPasswordStyles;
