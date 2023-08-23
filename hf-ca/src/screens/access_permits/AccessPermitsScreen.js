import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { genTestId } from "../../helper/AppHelper";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import { getAccessPermit } from "../../redux/AccessPermitSlice";
import { selectAccessPermitState } from "../../redux/AccessPermitSelector";
import AccessPermitItem from "./AccessPermitItem";
import AccessPermitListEmpty from "./AccessPermitListEmpty";
import AccessPermitCardLoading from "./AccessPermitCardLoading";
import AppTheme from "../../assets/_default/AppTheme";
import CommonHeader from "../../components/CommonHeader";
import profileSelectors from "../../redux/ProfileSelector";
import { getLoadingData } from "../../services/AccessPermitServices";
import { REQUEST_STATUS } from "../../constants/Constants";
import useFocus from "../../hooks/useFocus";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
});

export default function AccessPermitsScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const AccessPermitReduxData = useSelector(selectAccessPermitState);
    const refreshing = AccessPermitReduxData.requestStatus === REQUEST_STATUS.pending;
    const data = refreshing ? getLoadingData() : AccessPermitReduxData.data?.accessPermits;

    const getAccessPermitOfActiveProfile = () => {
        if (activeProfileId) {
            dispatch(getAccessPermit({ searchParams: { activeProfileId } }));
        }
    };
    useFocus(() => {
        getAccessPermitOfActiveProfile();
    });

    return (
        <View style={styles.container}>
            <CommonHeader title={t("accessPermits.myAccessPermits")} />
            <FlatList
                testID={genTestId("permitList")}
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
                        <AccessPermitItem
                            onPress={() => {
                                console.log("go to detail");
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
