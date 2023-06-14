import React, { useEffect } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HomeDiscoverySectionLoading from "./HomeDiscoverySectionLoading";
import HomeDiscoverySection from "./HomeDiscoverySection";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import Page from "../../components/Page";
import { getWeatherDataFromRedux } from "../../redux/WeatherSlice";
import { REQUEST_STATUS } from "../../constants/Constants";
import AppContract from "../../assets/_default/AppContract";
import HeaderBar from "../../components/HeaderBar";
import WelcomeBar from "../../components/WelcomeBar";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const weatherRequestStatus = useSelector((state) => state.requestStatus);

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, []);

    const refreshData = () => {
        dispatch(getWeatherDataFromRedux({ isForce: true }));
    };

    const renderItem = () => {
        if (weatherRequestStatus == REQUEST_STATUS.pending) {
            return <HomeDiscoverySectionLoading />;
        }
        return <HomeDiscoverySection />;
    };

    return (
        <View style={{ flex: 1 }}>
            <Page style={{ paddingBottom: 0, backgroundColor: AppTheme.colors.page_bg }}>
                <HeaderBar />
                <WelcomeBar firstName="Hannah" />
                <FlatList
                    refreshControl={
                        <RefreshControl
                            colors={[AppTheme.colors.primary]}
                            tintColor={AppTheme.colors.primary}
                            refreshing={weatherRequestStatus == REQUEST_STATUS.pending}
                            onRefresh={() => {
                                refreshData();
                            }}
                        />
                    }
                    data={[AppContract.strings.discovery]}
                    renderItem={() => {
                        return renderItem();
                    }}
                    keyExtractor={(item) => JSON.stringify(item)}
                    contentContainerStyle={{ paddingBottom: 41 + PAGE_MARGIN_BOTTOM }}
                />
            </Page>
        </View>
    );
}
