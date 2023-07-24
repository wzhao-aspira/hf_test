import { useEffect, useState, useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import PreferencePointDataView from "./PreferencePointDataView";
import PreferenceLoading from "./PreferencePointLoading";
import { getPreferencePointsByProfileId } from "../../services/PreferencePointService";
import selectors from "../../redux/ProfileSelector";
import LicenseListEmpty from "../licenses/LicenseListEmpty";
import AppTheme from "../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
});

function PreferencePointContent({ data }) {
    const { t } = useTranslation();

    if (isEmpty(data)) {
        return (
            <LicenseListEmpty
                title={t("preferencePoint.noPreferencePoint")}
                subtitle={t("preferencePoint.purchaseLicense")}
            />
        );
    }
    return <PreferencePointDataView data={data} />;
}

function PreferencePointScreen() {
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const currentInUseProfileID = useSelector(selectors.selectCurrentInUseProfileID);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPreferencePointData = useCallback(() => {
        setIsLoading(true);
        getPreferencePointsByProfileId(currentInUseProfileID)
            .then((restlt) => {
                setData(restlt);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentInUseProfileID]);

    useEffect(() => {
        getPreferencePointData();
    }, [getPreferencePointData]);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("preferencePoint.myPreferencePoint")} />
            <ScrollView
                nestedScrollEnabled
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={isLoading}
                        onRefresh={() => getPreferencePointData()}
                    />
                }
                contentContainerStyle={{ flex: 1, paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
            >
                {isLoading && <PreferenceLoading />}
                {!isLoading && <PreferencePointContent data={data} />}
            </ScrollView>
        </Page>
    );
}

export default PreferencePointScreen;
