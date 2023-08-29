import { useEffect } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getLicense } from "../../redux/LicenseSlice";
import { selectLicenseForList } from "../../redux/LicenseSelector";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import LicenseCardLoading from "./LicenseCardLoading";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import LicenseItem from "./LicenseItem";
import LicenseListEmpty from "./LicenseListEmpty";
import { getLoadingData } from "../../services/LicenseService";
import { genTestId } from "../../helper/AppHelper";
import { REQUEST_STATUS } from "../../constants/Constants";
import profileSelectors from "../../redux/ProfileSelector";

import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";

import useFocus from "../../hooks/useFocus";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
});

function LicenseListScreen() {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const reduxData = useSelector(selectLicenseForList);
    const refreshing = reduxData.requestStatus === REQUEST_STATUS.pending;
    const data = refreshing ? getLoadingData() : reduxData.data;
    const { t } = useTranslation();
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const getLicenseOfActiveProfile = (isForce) => {
        dispatch(getLicense({ isForce, searchParams: { activeProfileId } }));
    };

    useFocus(() => {
        getLicenseOfActiveProfile(false);
    });

    useEffect(() => {
        getLicenseOfActiveProfile(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("license.myLicense")} />
            <FlatList
                testID={genTestId("licenseList")}
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
                            getLicenseOfActiveProfile(true);
                        }}
                    />
                }
                scrollIndicatorInsets={{ right: 1 }}
                data={data}
                renderItem={({ item }) => {
                    if (refreshing) {
                        return <LicenseCardLoading />;
                    }

                    return (
                        <LicenseItem
                            onPress={() => {
                                console.log("go to license detail");
                                NavigationService.navigate(Routers.licenseDetail, { licenseData: item });
                            }}
                            itemData={item}
                            itemKey={item.id}
                        />
                    );
                }}
                keyExtractor={(item) => `${item.id}`}
                ListEmptyComponent={<LicenseListEmpty />}
            />
        </Page>
    );
}

export default LicenseListScreen;
