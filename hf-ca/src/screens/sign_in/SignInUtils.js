import { StyleSheet } from "react-native";
import AppTheme from "../../assets/BaseTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { emptyValidate } from "../profile/add_profile/ProfileValidate";

export const styles = StyleSheet.create({
    signInPage: {
        paddingBottom: 0,
    },
    contentContainerStyle: {
        paddingTop: 65,
        flexGrow: 1,
        paddingBottom: DEFAULT_MARGIN,
    },
    container: {
        flexDirection: "column",
        paddingHorizontal: DEFAULT_MARGIN,
        flex: 1,
    },

    titleStyle: {
        alignSelf: "center",
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_1,
        marginBottom: 10,
    },
    labelStyle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    inputStyle: {
        backgroundColor: AppTheme.colors.font_color_4,
    },
    signUpStr: {
        marginTop: 20,
        alignSelf: "center",
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_1,
    },
    signUpBtn: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.primary_2,
    },
    marginTopStyle: (value) => ({
        marginTop: value,
    }),
});

export const validateRequiredInput = (input, inputRef, emptyMsg) => {
    const errorMsg = emptyValidate(input, emptyMsg);
    inputRef.current?.setError(errorMsg);

    return !errorMsg.error;
};
