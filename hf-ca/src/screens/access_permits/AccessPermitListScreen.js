import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { genTestId } from "../../helper/AppHelper";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import { getAccessPermit } from "../../redux/AccessPermitSlice";
import { selectAccessPermitState } from "../../redux/AccessPermitSelector";
import AccessPermitListItem from "./access_permit_list/AccessPermitListItem";
import AccessPermitListEmpty from "./access_permit_list/AccessPermitListEmpty";
import AccessPermitCardLoading from "./access_permit_list/AccessPermitCardLoading";
import AppTheme from "../../assets/_default/AppTheme";
import CommonHeader from "../../components/CommonHeader";
import profileSelectors from "../../redux/ProfileSelector";
import { getLoadingData } from "../../services/AccessPermitServices";
import { REQUEST_STATUS } from "../../constants/Constants";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
});

export default function AccessPermitListScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const AccessPermitReduxData = useSelector(selectAccessPermitState);
    const refreshing = AccessPermitReduxData.requestStatus === REQUEST_STATUS.pending;
    const data = refreshing ? getLoadingData() : AccessPermitReduxData.data?.accessPermits;
    const attention = AccessPermitReduxData.data?.attention;

    const getAccessPermitOfActiveProfile = () => {
        if (activeProfileId) {
            dispatch(getAccessPermit({ searchParams: { activeProfileId } }));
        }
    };

    useEffect(() => {
        getAccessPermitOfActiveProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <CommonHeader title={t("accessPermits.myAccessPermits")} />
            <FlatList
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
                data={data}
                renderItem={({ item }) => {
                    if (refreshing) {
                        return <AccessPermitCardLoading />;
                    }

                    return (
                        <AccessPermitListItem
                            onPress={() => {
                                NavigationService.navigate(Routers.accessPermit, { accessPermitData: item, attention });
                            }}
                            itemData={item}
                            itemKey={item.id}
                        />
                    );
                }}
                keyExtractor={(item) => `${item.id}`}
                ListEmptyComponent={<AccessPermitListEmpty />}
            />
        </View>
    );
}
