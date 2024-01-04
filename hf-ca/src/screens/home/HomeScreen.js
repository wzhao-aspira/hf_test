import { View, FlatList, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import HomeDiscoverySectionLoading from "./HomeDiscoverySectionLoading";
import HomeDiscoverySection from "./HomeDiscoverySection";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import { getWeatherDataFromRedux } from "../../redux/WeatherSlice";
import { REQUEST_STATUS } from "../../constants/Constants";
import WelcomeBar from "../../components/WelcomeBar";
import { genTestId } from "../../helper/AppHelper";
import { getLicense } from "../../redux/LicenseSlice";
import { selectLicenseForDashboard, selectUpdateTime } from "../../redux/LicenseSelector";
import HomeLicenseSection from "./license/HomeLicenseSection";
import HomeLicenseSectionLoading from "./license/HomeLicenseSectionLoading";
import profileSelectors from "../../redux/ProfileSelector";
import useFocus from "../../hooks/useFocus";
import ProfileThunk from "../../redux/ProfileThunk";
import { actions as appActions, selectPrimaryInactivatedWhenSignIn } from "../../redux/AppSlice";
import Routers from "../../constants/Routers";
import { checkNeedAutoRefreshData } from "../../utils/GenUtil";
import { getProfileListUpdateTime } from "../../helper/AutoRefreshHelper";

export default function HomeScreen() {
    const dispatch = useDispatch();

    const profileListRequestStatus = useSelector(profileSelectors.selectProfileListRequestStatus);
    const profileListRefreshing = profileListRequestStatus == REQUEST_STATUS.pending;

    const weatherRequestStatus = useSelector((state) => state.weather.requestStatus);
    const licenseReduxData = useSelector(selectLicenseForDashboard);
    const licenseRefreshing = licenseReduxData.requestStatus === REQUEST_STATUS.pending;
    const licenseData = licenseReduxData.data;
    const { isShowSkeletonWhenOffline } = licenseReduxData;
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const primaryInactivatedWhenSignIn = useSelector(selectPrimaryInactivatedWhenSignIn);
    const licenseUpdateTime = useSelector(selectUpdateTime);
    const [refresh, setRefresh] = useState(false);

    const getLicenseOfActiveProfile = async (isForce, useCache) => {
        console.log("HomeScreen - getLicenseOfActiveProfile - activeProfileId:", activeProfileId);
        if (activeProfileId) {
            await dispatch(getLicense({ isForce, searchParams: { activeProfileId }, useCache }));
        }
    };

    useEffect(() => {
        console.log("home screen primaryInactivatedWhenSign:", primaryInactivatedWhenSignIn);
        if (primaryInactivatedWhenSignIn) {
            dispatch(appActions.toggleShowPrimaryProfileInactiveMsg(true));
        }
    }, [dispatch, primaryInactivatedWhenSignIn]);

    const getProfileAndLicense = async (isForce) => {
        const needAutoRefreshProfile = checkNeedAutoRefreshData(getProfileListUpdateTime());
        const needAutoRefreshLicense = checkNeedAutoRefreshData(licenseUpdateTime);
        setRefresh(isForce || needAutoRefreshProfile || needAutoRefreshLicense);

        const response = await dispatch(ProfileThunk.refreshProfileList({ isForce }));
        if (response.isReloadData && (response.primaryIsInactivated || response.ciuIsInactivated)) {
            setRefresh(false);
            return;
        }
        const useCache = !response.success;
        await getLicenseOfActiveProfile(isForce, useCache);
        setRefresh(false);
    };

    useFocus(async () => {
        console.log("home focus");
        dispatch(appActions.setCurrentRouter(Routers.home));
        await Promise.all([dispatch(getWeatherDataFromRedux({ isForce: false })), getProfileAndLicense(false)]).catch();
    });

    const refreshData = async () => {
        await Promise.all([dispatch(getWeatherDataFromRedux({ isForce: true })), getProfileAndLicense(true)]).catch();
    };

    const renderItem = (index) => {
        if (index == 0) {
            if (refresh || profileListRefreshing || licenseRefreshing || isShowSkeletonWhenOffline) {
                return <HomeLicenseSectionLoading />;
            }
            return <HomeLicenseSection licenses={licenseData} onRefresh={() => refreshData()} />;
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
                <WelcomeBar />
                <FlatList
                    testID={genTestId("HomeContentFlatList")}
                    refreshControl={
                        <RefreshControl
                            colors={[AppTheme.colors.primary]}
                            tintColor={AppTheme.colors.primary}
                            refreshing={
                                refresh ||
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
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </Page>
        </View>
    );
}
