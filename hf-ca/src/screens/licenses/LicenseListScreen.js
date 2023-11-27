import { useEffect } from "react";
import { StyleSheet, RefreshControl, View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import moment from "moment";
import { getLicense } from "../../redux/LicenseSlice";
import { selectLicenseForList } from "../../redux/LicenseSelector";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import LicenseCardLoading from "./LicenseCardLoading";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import LicenseItem from "./LicenseItem";
import LicenseListEmpty from "./LicenseListEmpty";
import { getLoadingData } from "../../services/LicenseService";
import { genTestId } from "../../helper/AppHelper";
import { LAST_UPDATE_TIME_DISPLAY_FORMAT, REQUEST_STATUS } from "../../constants/Constants";
import profileSelectors from "../../redux/ProfileSelector";
import useFocus from "../../hooks/useFocus";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import useTitle from "../../hooks/useTitle";
import SwitchCustomer from "../../components/SwitchCustomer";
import RefreshBar from "../../components/RefreshBar";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    groupTitleContainer: {
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: 16,
        marginBottom: 4,
    },
    groupTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
});

function LicenseListScreen() {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const reduxData = useSelector(selectLicenseForList);
    const refreshing = reduxData.requestStatus === REQUEST_STATUS.pending;
    const { isShowSkeletonWhenOffline } = reduxData;
    const data = refreshing || isShowSkeletonWhenOffline ? getLoadingData() : reduxData.data;
    const lastUpdateTimeFromServer = reduxData.lastUpdateTimeFromServer
        ? moment(reduxData.lastUpdateTimeFromServer).format(LAST_UPDATE_TIME_DISPLAY_FORMAT)
        : null;
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const title = useTitle("license.licenses", "license.myLicense");
    const getLicenseOfActiveProfile = (isForce, profileId = activeProfileId) => {
        if (profileId) {
            dispatch(getLicense({ isForce, searchParams: { activeProfileId: profileId } }));
        }
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
            <CommonHeader
                titleComponent={title}
                rightComponent={
                    <SwitchCustomer postProcess={(profileId) => getLicenseOfActiveProfile(true, profileId)} />
                }
            />

            <ScrollView
                testID={genTestId("licenseList")}
                contentContainerStyle={{
                    flexGrow: 1,
                    marginTop: 14,
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
            >
                <View style={{ flex: 1 }}>
                    {!refreshing && (
                        <RefreshBar
                            refreshTime={lastUpdateTimeFromServer}
                            style={{ marginHorizontal: DEFAULT_MARGIN, paddingVertical: 10 }}
                            onRefresh={() => getLicenseOfActiveProfile(true)}
                        />
                    )}
                    {!refreshing && !isShowSkeletonWhenOffline && isEmpty(data) && <LicenseListEmpty />}
                    {data?.map((item) => {
                        if (refreshing || isShowSkeletonWhenOffline) {
                            return <LicenseCardLoading key={item.id} />;
                        }
                        return (
                            <View key={item.groupKey}>
                                <View style={styles.groupTitleContainer}>
                                    <Text style={styles.groupTitle}>{item.title}</Text>
                                </View>
                                {item.data?.map((license) => (
                                    <LicenseItem
                                        key={license.id}
                                        onPress={() => {
                                            NavigationService.navigate(Routers.licenseDetail, { licenseData: license });
                                        }}
                                        itemData={license}
                                        itemKey={license.id}
                                    />
                                ))}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </Page>
    );
}

export default LicenseListScreen;
