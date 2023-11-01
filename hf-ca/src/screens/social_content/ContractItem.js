import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";

const EMAIL_WIDTH = 50;
const styles = StyleSheet.create({
    container: {
        ...AppTheme.shadow,
        borderRadius: 10,
        backgroundColor: AppTheme.colors.font_color_4,
        marginBottom: 30,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    titleContainer: {
        marginBottom: 10,
    },
    title: {
        flex: 1,
        fontFamily: "Bold",
        fontSize: 16,
        color: AppTheme.colors.font_color_1,
    },
    email: {
        fontFamily: "Bold",
        width: EMAIL_WIDTH,
    },
    call: {
        fontFamily: "Bold",
        width: EMAIL_WIDTH,
    },
    workingHours: {
        marginLeft: EMAIL_WIDTH,
    },
    bottomLine: {
        margin: StyleSheet.hairlineWidth,
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: AppTheme.colors.divider,
    },
    content: {
        fontSize: 12,
    },
});

function ContractItem({ item, onlyShowTitle, onPress }) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={[styles.itemContainer, styles.titleContainer]}>
                <Text style={styles.title}>{item.title}</Text>
                <PrimaryBtn
                    testID={genTestId(`website_${item.title}`)}
                    label={t("contact.webSite")}
                    onPress={() => {
                        onPress(item);
                    }}
                    labelStyle={{ paddingVertical: 6 }}
                />
            </View>
            {!onlyShowTitle && (
                <>
                    <View style={styles.bottomLine} />
                    <View style={[styles.itemContainer]}>
                        <Text style={styles.email}>{t("contact.email")}</Text>
                        <Text style={styles.content}>{item.email}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.call}>{t("contact.call")}</Text>
                        <Text style={styles.content}>{item.phone}</Text>
                    </View>
                    <View style={styles.workingHours}>
                        <Text style={styles.content}>{item.workingHours}</Text>
                    </View>
                </>
            )}
        </View>
    );
}

export default ContractItem;
