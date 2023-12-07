import { View, Text, StyleSheet, Linking, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import AppTheme from "../../assets/_default/AppTheme";
import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";
import RenderHTML from "../../components/RenderHTML";
import { SCREEN_WIDTH } from "../../constants/Dimension";
import contactUsViaEmail from "../../helper/MailHelper";
import useDialog from "../../components/dialog/useDialog";

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
    titleContentContainer: {
        flexDirection: "column",
        width: "66%",
        marginRight: 10,
    },
    linkButtonText: {
        ...AppTheme.typography.overlay_sub_text,
        textDecorationLine: "underline",
        color: AppTheme.colors.fishing_blue,
    },
});

function LinkButton({ text, href, onPress }) {
    return (
        <View>
            <Pressable
                onPress={() => {
                    if (onPress) {
                        onPress();
                    } else if (!isEmpty(href)) {
                        Linking.openURL(href);
                    }
                }}
            >
                <Text style={styles.linkButtonText}>{text}</Text>
            </Pressable>
        </View>
    );
}

function ContractItem({ item, onlyShowTitle, onPress }) {
    const { t } = useTranslation();
    const { openSimpleDialog } = useDialog();
    return (
        <View style={styles.container}>
            <View style={[styles.itemContainer, styles.titleContainer]}>
                <View style={styles.titleContentContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    {item.desc && <RenderHTML source={{ html: item.desc }} contentWidth={SCREEN_WIDTH} />}
                </View>
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
                        <LinkButton
                            text={item.email}
                            onPress={() => {
                                console.log(`send email:${item.email}`);
                                contactUsViaEmail(item.email, openSimpleDialog);
                            }}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.call}>{t("contact.call")}</Text>
                        <LinkButton text={item.phone} href={`tel:${item.noFormatPhone}`} />
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
