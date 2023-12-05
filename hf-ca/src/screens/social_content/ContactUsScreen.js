import { FlatList, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import ContractItem from "./ContractItem";
import { openLink } from "../../helper/AppHelper";
import { styles } from "./SocialContentUtils";
import { getContactUsLinks } from "../../services/LinkService";

function ContactUsScreen() {
    const { t, i18n } = useTranslation();
    const contactList = getContactUsLinks(i18n, t);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("common.contactUs")} />
            <Text style={styles.title}>{t("common.contactUs")}</Text>
            <ScrollView>
                <View style={styles.list}>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={styles.contentContainerStyle}
                        data={contactList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            const onlyShowTitle = index === contactList.length - 1;
                            return (
                                <ContractItem
                                    item={item}
                                    onlyShowTitle={onlyShowTitle}
                                    onPress={() => {
                                        openLink(item.url);
                                    }}
                                />
                            );
                        }}
                    />
                </View>
            </ScrollView>
        </Page>
    );
}

export default ContactUsScreen;
