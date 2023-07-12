import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import ListItem from "../shared/ListItem";
import AppContract from "../../assets/_default/AppContract";
import { openLink } from "../../helper/AppHelper";
import { getListData, styles } from "./SocialContentUtils";

function FollowUsScreen() {
    const { t, i18n } = useTranslation();
    const socialtList = getListData(i18n, t, AppContract.socialList);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("common.followUs")} />
            <Text style={styles.title}>{t("common.followUs")}</Text>
            <View style={styles.list}>
                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={socialtList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const hiddenBottomLine = index === socialtList.length - 1;
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

export default FollowUsScreen;
