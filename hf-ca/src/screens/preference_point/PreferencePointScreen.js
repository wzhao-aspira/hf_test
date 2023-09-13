import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
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
import { handleError } from "../../network/APIUtil";
import useFocus from "../../hooks/useFocus";
import { checkNeedAutoRefreshData } from "../../utils/GenUtil";
import { getPreferencePointListUpdateTime, setPreferencePointListUpdateTime } from "../../helper/AutoRefreshHelper";
import { getPreferencePointListFromDB, savePreferencePointListToDB } from "../../db";

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
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const currentInUseProfileID = useSelector(selectors.selectCurrentInUseProfileID);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasOfflineData, setHasOfflineData] = useState(true);

    const getPreferencePointData = async (isForce) => {
        if (isLoading) {
            return;
        }

        console.log(`currentInUseProfileID:${currentInUseProfileID}`);
        if (!isForce && checkNeedAutoRefreshData(getPreferencePointListUpdateTime(currentInUseProfileID)) == false) {
            const result = await getPreferencePointListFromDB(currentInUseProfileID);
            console.log(`db preference point list:${JSON.stringify(result)}`);
            setData(result);
            return;
        }

        setIsLoading(true);
        setHasOfflineData(true);
        const response = await handleError(getPreferencePointsByProfileId(currentInUseProfileID), {
            dispatch,
            networkErrorByDialog: false,
        });
        console.log(`response:${JSON.stringify(response)}`);
        let isAPIError = false;
        if (response.success) {
            console.log(`api preference point list:${JSON.stringify(response.data.data.result)}`);
            const formattedResult = response.data.data.result.map((item) => {
                const { huntTypeName, currentPreferencePoints, lastParticipationLicenseYear } = item;

                return {
                    pk: `${currentInUseProfileID}_${huntTypeName}_${currentPreferencePoints}_${lastParticipationLicenseYear}`,
                    profileId: currentInUseProfileID,
                    huntTypeName,
                    currentPreferencePoints,
                    lastParticipationLicenseYear,
                };
            });

            await savePreferencePointListToDB(formattedResult);
            setPreferencePointListUpdateTime(currentInUseProfileID);
        } else {
            isAPIError = true;
        }

        const result = await getPreferencePointListFromDB(currentInUseProfileID);
        console.log(`db preference point list:${JSON.stringify(result)}`);

        // if api error, and offline data is empty, it still need to show the skeleton
        if (isAPIError && isEmpty(result)) {
            console.log("if api error, and offline data is empty, it still need to show the skeleton");
            setHasOfflineData(false);
        } else {
            setData(result);
        }
        setIsLoading(false);
    };

    useFocus(() => {
        getPreferencePointData(false);
    });

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
                        onRefresh={() => getPreferencePointData(true)}
                    />
                }
                contentContainerStyle={{ flex: 1, paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
            >
                {(isLoading || !hasOfflineData) && <PreferenceLoading />}
                {!isLoading && hasOfflineData && <PreferencePointContent data={data} />}
            </ScrollView>
        </Page>
    );
}

export default PreferencePointScreen;
