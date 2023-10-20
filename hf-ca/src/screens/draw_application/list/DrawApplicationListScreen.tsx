import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Page from "../../../components/Page";
import CommonHeader from "../../../components/CommonHeader";
import DrawApplicationListEmpty from "./DrawApplicationListEmpty";
import AppTheme from "../../../assets/_default/AppTheme";
import DrawApplicationTabContainer from "./tab_View/DrawApplicationTabContainer";
import { getDrawList } from "../../../redux/DrawApplicationSlice";
import profileSelectors from "../../../redux/ProfileSelector";
import drawSelectors from "../../../redux/DrawApplicationSelector";
import DrawApplicationListLoading from "./DrawApplicationListLoading";
import { useAppDispatch } from "../../../hooks/redux";
import { genTestId } from "../../../helper/AppHelper";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
});

function SuccessfulRoute() {
    const data = useSelector(drawSelectors.selectSuccessfulData);
    const isEmptyData = useSelector(drawSelectors.selectSuccessfulDataIsEmpty);
    return <DrawApplicationTabContainer tabData={data} tabName="successful" isEmptyTab={isEmptyData} />;
}

function UnsuccessfulRoute() {
    const data = useSelector(drawSelectors.selectUnsuccessfulData);
    const isEmptyData = useSelector(drawSelectors.selectUnsuccessfulDataIsEmpty);
    return <DrawApplicationTabContainer tabData={data} tabName="unsuccessful" isEmptyTab={isEmptyData} />;
}

function PendingRoute() {
    const list = useSelector(drawSelectors.selectPendingList);
    const isEmptyData = useSelector(drawSelectors.selectPendingListIsEmpty);
    return <DrawApplicationTabContainer list={list} tabName="pending" isEmptyTab={isEmptyData} />;
}

const renderTabBar = (props) => (
    <TabBar
        {...props}
        pressColor={AppTheme.colors.page_bg}
        indicatorStyle={{ backgroundColor: AppTheme.colors.indicator }}
        style={{ backgroundColor: AppTheme.colors.body_50, shadowColor: AppTheme.colors.body_50 }}
        renderLabel={({ route, focused }) => (
            <Text
                style={{
                    color: AppTheme.colors.black,
                    fontWeight: focused ? "500" : "normal",
                    paddingHorizontal: focused ? 0 : 6,
                    textAlign: "center",
                }}
                testID={genTestId(`drawApplicationTab_${route.key}`)}
            >
                {route.title}
            </Text>
        )}
    />
);

const renderScene = SceneMap({
    successful: SuccessfulRoute,
    unsuccessful: UnsuccessfulRoute,
    pending: PendingRoute,
});

function DrawListContent() {
    const { t } = useTranslation();

    const refreshing = useSelector(drawSelectors.selectIsDrawListLoading);
    const drawListIsEmpty = useSelector(drawSelectors.selectDrawListIsEmpty);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "successful", title: t("drawApplicationList.successful") },
        { key: "unsuccessful", title: t("drawApplicationList.unsuccessful") },
        { key: "pending", title: t("drawApplicationList.pending") },
    ]);

    if (refreshing) {
        return <DrawApplicationListLoading />;
    }
    if (drawListIsEmpty) {
        return <DrawApplicationListEmpty />;
    }
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            swipeEnabled={false}
            renderTabBar={renderTabBar}
        />
    );
}

function DrawApplicationListScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            dispatch(getDrawList(activeProfileId));
        }
    };

    useEffect(() => {
        getDrawListByProfileId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("drawApplicationList.draws")} rightIcon={false} subTitle={false} />
            <View style={{ flex: 1, backgroundColor: AppTheme.colors.page_bg }}>
                <DrawListContent />
            </View>
        </Page>
    );
}

export default DrawApplicationListScreen;
