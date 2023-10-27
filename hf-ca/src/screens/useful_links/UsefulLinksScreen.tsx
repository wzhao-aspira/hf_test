import { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import { getUsefulLinksFromCache, saveUsefulLinksToCache, getUsefulLinksData } from "../../services/UsefulLinksService";
import type { UsefulLinkData } from "../../types/usefulLink";
import { handleError } from "../../network/APIUtil";
import OutlinedBtn from "../../components/OutlinedBtn";
import { genTestId, openLink } from "../../helper/AppHelper";
import UsefulLinksLoading from "./UsefulLinksLoading";

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppTheme.colors.page_bg,
        paddingBottom: 0,
    },
    listView: {
        flex: 1,
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: DEFAULT_MARGIN,
        paddingBottom: DEFAULT_MARGIN,
    },
    itemContainer: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginVertical: 8,
    },
    title: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    description: {
        ...AppTheme.typography.overlay_sub_text,
        marginTop: 12,
        color: AppTheme.colors.font_color_2,
    },
    bottomBtnContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
});

function UsefulLinksContent({ data, refreshing, noCacheData }) {
    const { t } = useTranslation();

    if (refreshing || noCacheData) {
        return <UsefulLinksLoading />;
    }

    return data?.map((item) => (
        <View key={item.title} style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.bottomBtnContainer}>
                <OutlinedBtn
                    testID={genTestId(`viewOnlineButton`)}
                    label={t("usefulLinks.viewOnline")}
                    onPress={() => {
                        openLink(item.linkUrl);
                    }}
                />
            </View>
        </View>
    ));
}

function UsefulLinksScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [data, setData] = useState<UsefulLinkData[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [noCacheData, setNoCacheData] = useState(false);

    const getUsefulLinks = useCallback(async () => {
        setRefreshing(true);
        const response = await handleError(getUsefulLinksData(), {
            dispatch,
            networkErrorByDialog: false,
        });
        if (response.success && !isEmpty(response?.data)) {
            await saveUsefulLinksToCache(response.data);
        }

        const cacheUsefulLinks = await getUsefulLinksFromCache();
        if (isEmpty(cacheUsefulLinks)) {
            setNoCacheData(true);
        } else {
            setNoCacheData(false);
            setData(cacheUsefulLinks);
        }

        setRefreshing(false);
    }, [dispatch]);

    useEffect(() => {
        getUsefulLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("usefulLinks.usefulLinks")} rightIcon={null} />
            <ScrollView>
                <View style={styles.listView}>
                    <UsefulLinksContent data={data} refreshing={refreshing} noCacheData={noCacheData} />
                </View>
            </ScrollView>
        </Page>
    );
}

export default UsefulLinksScreen;
