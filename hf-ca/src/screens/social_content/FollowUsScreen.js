import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import ListItem from "../shared/ListItem";
import { openLink } from "../../helper/AppHelper";
import { styles } from "./SocialContentUtils";
import { getSocialLinks } from "../../services/LinkService";

function FollowUsScreen() {
    const { t, i18n } = useTranslation();
    const socialList = getSocialLinks(i18n, t);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("common.followUs")} />
            <Text style={styles.title}>{t("common.followUs")}</Text>
            <View style={styles.list}>
                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={socialList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const hiddenBottomLine = index === socialList.length - 1;
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
