import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import PreferencePointDataView from "./PreferencePointDataView";
import PreferenceLoading from "./PreferencePointLoading";
import selectors from "../../redux/ProfileSelector";
import LicenseListEmpty from "../licenses/LicenseListEmpty";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import useFocus from "../../hooks/useFocus";
import { getPreferencePoint } from "../../redux/PreferencePointSlice";
import {
    selectLastUpdateDate,
    selectPreferencePointList,
    selectPreferencePointRequestStatus,
    selectShowSkeletonWhenOffline,
} from "../../redux/PreferencePointSelector";
import { REQUEST_STATUS } from "../../constants/Constants";
import useTitle from "../../hooks/useTitle";
import SwitchCustomer from "../../components/SwitchCustomer";
import RefreshBar from "../../components/RefreshBar";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    refreshBar: {
        marginHorizontal: DEFAULT_MARGIN,
        paddingVertical: 20,
    },
});

function PreferencePointContent({ data }) {
    const { t } = useTranslation();

    if (isEmpty(data)) {
        return (
            <LicenseListEmpty
                showPurchase={false}
                title={t("preferencePoint.noPreferencePoint")}
                subtitle={t("preferencePoint.purchaseLicense")}
            />
        );
    }
    return <PreferencePointDataView data={data} />;
}

function PreferencePointScreen() {
    const dispatch = useDispatch();
    const title = useTitle("preferencePoint.firstNamePreferencePoint", "preferencePoint.myPreferencePoint");

    const safeAreaInsets = useSafeAreaInsets();

    const activeProfileId = useSelector(selectors.selectCurrentInUseProfileID);

    const lastUpdateDate = useSelector(selectLastUpdateDate);
    const data = useSelector(selectPreferencePointList);
    const requestStatus = useSelector(selectPreferencePointRequestStatus);
    const showSkeletonWhenOffline = useSelector(selectShowSkeletonWhenOffline);
    const isLoading = requestStatus == REQUEST_STATUS.pending;

    console.log(`isLoading:${isLoading}`);
    console.log(`requestStatus:${requestStatus}`);
    console.log(`showSkeletonWhenOffline:${showSkeletonWhenOffline}`);
    console.log(`preference point data:${JSON.stringify(data)}`);

    const getPreferencePointData = (isForce, profileId = activeProfileId) => {
        dispatch(getPreferencePoint({ searchParams: { activeProfileId: profileId }, isForce }));
    };

    useFocus(() => {
        getPreferencePointData(false);
    });

    return (
        <Page style={styles.container}>
            <CommonHeader
                title={title}
                rightComponent={<SwitchCustomer postProcess={(profileId) => getPreferencePointData(true, profileId)} />}
            />
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
                {!isLoading && (
                    <RefreshBar
                        refreshTime={lastUpdateDate}
                        onRefresh={() => getPreferencePointData(true)}
                        style={styles.refreshBar}
                    />
                )}
                {(isLoading || showSkeletonWhenOffline) && <PreferenceLoading />}
                {!isLoading && !showSkeletonWhenOffline && <PreferencePointContent data={data} />}
            </ScrollView>
        </Page>
    );
}

export default PreferencePointScreen;
