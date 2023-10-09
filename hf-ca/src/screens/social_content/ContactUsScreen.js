import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import ListItem from "../shared/ListItem";
import AppContract from "../../assets/_default/AppContract";
import { openLink } from "../../helper/AppHelper";
import { getListData, styles } from "./SocialContentUtils";
import { appConfig } from "../../services/AppConfigService";

function ContactUsScreen() {
    const { t, i18n } = useTranslation();
    const newContactList = AppContract.contactList;
    newContactList[0].url = appConfig.data.contactCDFWLink;
    const contactList = getListData(i18n, t, newContactList);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("common.contactUs")} />
            <Text style={styles.title}>{t("common.contactUs")}</Text>
            <View style={styles.list}>
                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={contactList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const hiddenBottomLine = index === contactList.length - 1;
                        return (
                            <ListItem
                                item={item}
                                hiddenBottomLine={hiddenBottomLine}
                                onPress={() => {
                                    openLink(item.url);
                                }}
                            />
                        );
                    }}
                />
            </View>
        </Page>
    );
}

export default ContactUsScreen;
