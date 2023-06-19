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
import HeaderBar from "../../components/HeaderBar";
import WelcomeBar from "../../components/WelcomeBar";
import { genTestId } from "../../helper/AppHelper";
import Routers from "../../constants/Routers";
import NavigationService from "../../navigation/NavigationService";
import PrimaryBtn from "../../components/PrimaryBtn";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const weatherRequestStatus = useSelector((state) => state.weather.requestStatus);

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, []);

    const refreshData = () => {
        dispatch(getWeatherDataFromRedux({ isForce: true }));
    };

    const renderItem = (index) => {
        if (index == 0) {
            if (weatherRequestStatus == REQUEST_STATUS.pending) {
                return <HomeDiscoverySectionLoading />;
            }
            return <HomeDiscoverySection />;
        }
        if (index == 1) {
            return (
                <>
                    <PrimaryBtn
                        style={{ margin: 20 }}
                        label="Show CRSS Screen"
                        onPress={() => NavigationService.navigate(Routers.crss)}
                    />
                    <PrimaryBtn
                        style={{ margin: 20 }}
                        onPress={() => {
                            NavigationService.navigate(Routers.addProfile);
                        }}
                        label="Add profile"
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
                            refreshing={weatherRequestStatus == REQUEST_STATUS.pending}
                            onRefresh={(index) => {
                                refreshData(index);
                            }}
                        />
                    }
                    data={["Discovery", "ShowCRSSSCreen"]}
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
