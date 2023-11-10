import { View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { genTestId } from "../../helper/AppHelper";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import { getAccessPermit } from "../../redux/AccessPermitSlice";
import { selectAccessPermitState } from "../../redux/AccessPermitSelector";
import AccessPermitListItem from "./access_permit_list/AccessPermitListItem";
import AccessPermitListEmpty from "./access_permit_list/AccessPermitListEmpty";
import AccessPermitCardLoading from "./access_permit_list/AccessPermitCardLoading";
import AppTheme from "../../assets/_default/AppTheme";
import CommonHeader from "../../components/CommonHeader";
import SwitchCustomer from "../../components/SwitchCustomer";
import profileSelectors from "../../redux/ProfileSelector";
import { getLoadingData } from "../../services/AccessPermitServices";
import { REQUEST_STATUS } from "../../constants/Constants";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import useTitle from "../../hooks/useTitle";
import RefreshBar from "../../components/RefreshBar";
import useFocus from "../../hooks/useFocus";
import { getFormattedLastUpdateDate } from "../../utils/DateUtils";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
    refreshBar: {
        marginHorizontal: DEFAULT_MARGIN,
        paddingTop: 10,
        paddingBottom: 20,
    },
});

const showData = (data, refreshing, loadingData, attention, customer, isShowSkeletonInOffline) => {
    if (refreshing || isShowSkeletonInOffline) {
        return loadingData.map((item) => <AccessPermitCardLoading key={item.id} />);
    }

    if (isEmpty(data)) {
        return <AccessPermitListEmpty />;
    }
    return data?.map((item) => {
        return (
            <AccessPermitListItem
                key={item.id}
                onPress={() => {
                    NavigationService.navigate(Routers.accessPermit, {
                        accessPermitData: item,
                        attention,
                        customer,
                    });
                }}
                itemData={item}
                itemKey={item.id}
            />
        );
    });
};

export default function AccessPermitListScreen() {
    const title = useTitle("accessPermits.firstNameAccessPermits", "accessPermits.myAccessPermits");
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const AccessPermitReduxData = useSelector(selectAccessPermitState);
    const refreshing = AccessPermitReduxData.requestStatus === REQUEST_STATUS.pending;
    const data = AccessPermitReduxData.data?.accessPermits;
    const loadingData = getLoadingData();
    const isOffline = AccessPermitReduxData.offline;
    // offline without data in db, show Skeleton. Even offline with empty accessPermits in db, doesn't show Skeleton.
    const isShowSkeletonInOffline = isOffline && isEmpty(AccessPermitReduxData.data);
    const attention = AccessPermitReduxData.data?.attention;
    const customer = AccessPermitReduxData.data?.customer;
    const lastUpdateDate = getFormattedLastUpdateDate(AccessPermitReduxData.data?.lastUpdateDate);

    const getAccessPermitOfActiveProfile = (profileId = activeProfileId) => {
        if (profileId) {
            dispatch(getAccessPermit({ searchParams: { activeProfileId: profileId } }));
        }
    };

    useFocus(() => {
        getAccessPermitOfActiveProfile();
    });

    return (
        <View style={styles.container}>
            <CommonHeader
                title={title}
                rightComponent={
                    <SwitchCustomer postProcess={(profileId) => getAccessPermitOfActiveProfile(profileId)} />
                }
            />

            <ScrollView
                testID={genTestId("accessPermitList")}
                contentContainerStyle={{
                    flexGrow: 1,
                    marginTop: 20,
                    paddingBottom: insets.bottom + PAGE_MARGIN_BOTTOM,
                }}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={refreshing}
                        onRefresh={() => {
                            getAccessPermitOfActiveProfile();
                        }}
                    />
                }
            >
                <View style={{ flex: 1 }}>
                    {!refreshing && (
                        <RefreshBar
                            refreshTime={lastUpdateDate}
                            style={styles.refreshBar}
                            onRefresh={getAccessPermitOfActiveProfile}
                        />
                    )}
                    {showData(data, refreshing, loadingData, attention, customer, isShowSkeletonInOffline)}
                </View>
            </ScrollView>
        </View>
    );
}
