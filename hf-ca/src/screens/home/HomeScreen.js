import { useEffect } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import HomeDiscoverySectionLoading from "./HomeDiscoverySectionLoading";
import HomeDiscoverySection from "./HomeDiscoverySection";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import { getWeatherDataFromRedux } from "../../redux/WeatherSlice";
import { REQUEST_STATUS } from "../../constants/Constants";
import HeaderBar from "../../components/HeaderBar";
import WelcomeBar from "../../components/WelcomeBar";
import { genTestId } from "../../helper/AppHelper";
import { getLicense } from "../../redux/LicenseSlice";
import { selectLicenseForDashboard } from "../../redux/LicenseSelector";
import HomeLicenseSection from "./license/HomeLicenseSection";
import HomeLicenseSectionLoading from "./license/HomeLicenseSectionLoading";
import profileSelectors from "../../redux/ProfileSelector";
import useFocus from "../../hooks/useFocus";
import ProfileThunk from "../../redux/ProfileThunk";
import DialogHelper from "../../helper/DialogHelper";
import i18n from "../../localization/i18n";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { actions as profileActions } from "../../redux/ProfileSlice";

export default function HomeScreen() {
    const dispatch = useDispatch();

    const profileListRequestStatus = useSelector(profileSelectors.selectProfileListRequestStatus);
    const profileListRefreshing = profileListRequestStatus == REQUEST_STATUS.pending;

    const weatherRequestStatus = useSelector((state) => state.weather.requestStatus);
    const licenseReduxData = useSelector(selectLicenseForDashboard);
    const licenseRefreshing = licenseReduxData.requestStatus === REQUEST_STATUS.pending;
    const licenseData = licenseReduxData.data;
    const isEmptyLicenseCacheData = isEmpty(licenseData) && !licenseReduxData.isAPISucceed;
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const ciuIsInactive = useSelector(profileSelectors.selectCiuIsInactive);
    const primaryProfileId = useSelector(profileSelectors.selectPrimaryProfileID);

    const getLicenseOfActiveProfile = (isForce) => {
        if (activeProfileId) {
            dispatch(getLicense({ isForce, searchParams: { activeProfileId } }));
        }
    };

    // sign in: need to check ciuIsInactive
    useEffect(() => {
        console.log("home screen ciuIsInactive-:", ciuIsInactive);
        if (ciuIsInactive && primaryProfileId) {
            DialogHelper.showSimpleDialog({
                title: i18n.t("common.reminder"),
                message: i18n.t("profile.currentInUseInactiveMsg"),
                okText: i18n.t("common.gotIt"),
                okAction: () => {
                    dispatch(profileActions.updateCiuProfileIsInactive(false));
                    dispatch(ProfileThunk.switchCurrentInUseProfile(primaryProfileId));
                    NavigationService.navigate(Routers.manageProfile);
                },
            });
        }
    }, [ciuIsInactive, dispatch, primaryProfileId]);

    useFocus(() => {
        console.log("home focus");
        dispatch(getWeatherDataFromRedux({}));
        dispatch(ProfileThunk.refreshProfileList());
        getLicenseOfActiveProfile(false);
    });

    const refreshData = () => {
        dispatch(getWeatherDataFromRedux({ isForce: true }));
        dispatch(ProfileThunk.refreshProfileList({ isForce: true }));
        getLicenseOfActiveProfile(true);
    };

    const renderItem = (index) => {
        if (index == 0) {
            if (licenseRefreshing || isEmptyLicenseCacheData) {
                return <HomeLicenseSectionLoading />;
            }
            return <HomeLicenseSection licenses={licenseData} />;
        }
        if (index == 1) {
            if (weatherRequestStatus == REQUEST_STATUS.pending) {
                return <HomeDiscoverySectionLoading />;
            }
            return <HomeDiscoverySection />;
        }
        return null;
    };

    return (
        <View style={{ flex: 1 }}>
            <Page style={{ paddingBottom: 0, backgroundColor: AppTheme.colors.page_bg }}>
                <HeaderBar />
                <WelcomeBar />
                <FlatList
                    testID={genTestId("HomeContentFlatList")}
                    refreshControl={
                        <RefreshControl
                            colors={[AppTheme.colors.primary]}
                            tintColor={AppTheme.colors.primary}
                            refreshing={
                                weatherRequestStatus == REQUEST_STATUS.pending ||
                                licenseRefreshing ||
                                profileListRefreshing
                            }
                            onRefresh={(index) => {
                                refreshData(index);
                            }}
                        />
                    }
                    data={["Licenses", "Discovery"]}
                    renderItem={({ index }) => {
                        return renderItem(index);
                    }}
                    keyExtractor={(item) => JSON.stringify(item)}
                    contentContainerStyle={{ paddingBottom: 41 + PAGE_MARGIN_BOTTOM }}
                />
            </Page>
        </View>
    );
}
