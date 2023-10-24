import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import RegulationListLoading from "./RegulationListLoading";
import Page from "../../../components/Page";
import CommonHeader from "../../../components/CommonHeader";
import RegulationListDataView from "./RegulationListDataView";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";
import { handleError } from "../../../network/APIUtil";
import { getCacheRegulations, getRegulationData, saveCacheRegulations } from "../../../services/RegulationService";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        marginTop: 200,
        marginHorizontal: DEFAULT_MARGIN,
    },
    emptyArea: {
        width: "100%",
    },
    emptyTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
});

function RegulationListContent({ data }) {
    if (isEmpty(data)) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyArea}>
                    <Text testID={genTestId("noRegulations")} style={styles.emptyTitle}>
                        <Trans i18nKey="regulation.noRegulationTitle" />
                    </Text>
                </View>
            </View>
        );
    }
    return <RegulationListDataView data={data} />;
}

function RegulationListScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [showSkeletonWhenOffline, setShowSkeletonWhenOffline] = useState(false);
    const [regulationData, setRegulationData] = useState(null);

    console.log(`isLoading:${refreshing}`);
    console.log(`showSkeletonWhenOffline:${showSkeletonWhenOffline}`);
    console.log(`regulation data:${JSON.stringify(regulationData)}`);

    const getRegulationListData = async () => {
        setRefreshing(true);

        const response = await handleError(getRegulationData(), {
            dispatch,
            networkErrorByDialog: false,
        });

        console.log(`regulation api response:${JSON.stringify(response)}`);

        if (response.success && !isEmpty(response?.data?.data?.result)) {
            await saveCacheRegulations(response.data.data.result);
        }

        const cacheRegulationData = await getCacheRegulations();
        if (isEmpty(cacheRegulationData)) {
            setShowSkeletonWhenOffline(true);
        } else {
            setShowSkeletonWhenOffline(false);
            setRegulationData(cacheRegulationData);
        }

        setRefreshing(false);
    };

    useEffect(() => {
        getRegulationListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("regulation.headerTitle")} />
            <ScrollView
                nestedScrollEnabled
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={refreshing}
                        onRefresh={() => getRegulationListData()}
                    />
                }
            >
                {(refreshing || showSkeletonWhenOffline) && <RegulationListLoading />}
                {!refreshing && !showSkeletonWhenOffline && <RegulationListContent data={regulationData} />}
            </ScrollView>
        </Page>
    );
}

export default RegulationListScreen;
