import { StyleSheet } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },

    title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: 25,
        marginHorizontal: DEFAULT_MARGIN,
    },

    list: {
        marginTop: 16,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
    },
    contentContainerStyle: {
        borderRadius: 10,
        overflow: "hidden",
    },
});

export const getListData = (i18n, t, list = []) => {
    const data = list?.map((item) => {
        const title = i18n.exists(`contact.${item.titleKey}`) ? t(`contact.${item.titleKey}`) : item.titleKey;
        return { ...item, title };
    });
    return data;
};
