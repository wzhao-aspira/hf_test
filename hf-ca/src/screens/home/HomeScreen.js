import React, { useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
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
import Routers from "../../constants/Routers";
import NavigationService from "../../navigation/NavigationService";
import PrimaryBtn from "../../components/PrimaryBtn";
import { getLicense } from "../../redux/LicenseSlice";
import { selectLicenseForDashboard } from "../../redux/LicenseSelector";
import HomeLicenseSection from "./license/HomeLicenseSection";
import HomeLicenseSectionLoading from "./license/HomeLicenseSectionLoading";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const weatherRequestStatus = useSelector((state) => state.weather.requestStatus);
    const licenseReduxData = useSelector(selectLicenseForDashboard);
    const licenseRefreshing = licenseReduxData.requestStatus === REQUEST_STATUS.pending;
    const licenseData = licenseReduxData.data;

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, []);

    useFocusEffect(
        useCallback(() => {
            dispatch(getLicense({ isForce: false }));
        }, [])
    );

    const refreshData = () => {
        dispatch(getWeatherDataFromRedux({ isForce: true }));
        dispatch(getLicense({ isForce: true }));
    };

    const renderItem = (index) => {
        if (index == 0) {
            if (licenseRefreshing) {
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
        if (index == 2) {
            return (
                <>
                    <PrimaryBtn
                        style={{ margin: 20 }}
                        label="Show CRSS Screen"
                        onPress={() => NavigationService.navigate(Routers.crss)}
                    />
                </>
            );
        }
        return <></>;
    };

    return (
        <View style={{ flex: 1 }}>
            <Page style={{ paddingBottom: 0, backgroundColor: AppTheme.colors.page_bg }}>
                <HeaderBar />
                <WelcomeBar firstName="Hannah" />
                <FlatList
                    testID={genTestId("HomeContentFlatList")}
                    refreshControl={
                        <RefreshControl
                            colors={[AppTheme.colors.primary]}
                            tintColor={AppTheme.colors.primary}
                            refreshing={weatherRequestStatus == REQUEST_STATUS.pending || licenseRefreshing}
                            onRefresh={(index) => {
                                refreshData(index);
                            }}
                        />
                    }
                    data={["Licenses", "Discovery", "ShowCRSSSCreen"]}
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
