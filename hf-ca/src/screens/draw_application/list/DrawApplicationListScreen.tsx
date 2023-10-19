import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Page from "../../../components/Page";
import CommonHeader from "../../../components/CommonHeader";
import DrawApplicationListEmpty from "./DrawApplicationListEmpty";
import AppTheme from "../../../assets/_default/AppTheme";
import DrawApplicationTabItem from "./DrawApplicationTabItem";
import { getDrawList } from "../../../redux/DrawApplicationSlice";
import profileSelectors from "../../../redux/ProfileSelector";
import drawSelectors from "../../../redux/DrawApplicationSelector";
import DrawApplicationListLoading from "./DrawApplicationListLoading";
import { REQUEST_STATUS } from "../../../constants/Constants";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
});

function SuccessfulRoute() {
    return <DrawApplicationTabItem list={[]} />;
}

function UnsuccessfulRoute() {
    return <DrawApplicationTabItem list={[]} />;
}

function PendingRoute() {
    return <DrawApplicationTabItem list={[]} />;
}

const renderTabBar = (props) => (
    <TabBar
        {...props}
        pressColor={AppTheme.colors.page_bg}
        indicatorStyle={{ backgroundColor: AppTheme.colors.fishing_blue }}
        style={{ backgroundColor: AppTheme.colors.page_bg, shadowColor: AppTheme.colors.page_bg }}
        renderLabel={({ route, focused }) => (
            <Text
                style={{
                    color: AppTheme.colors.black,
                    fontWeight: focused ? "500" : "normal",
                    paddingHorizontal: focused ? 0 : 6,
                    textAlign: "center",
                }}
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

    const drawRequestStatus = useSelector(drawSelectors.selectDrawRequestStatus);
    const refreshing = drawRequestStatus.requestStatus === REQUEST_STATUS.pending;
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
    const dispatch = useDispatch();

    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    useEffect(() => {
        // @ts-ignore
        dispatch(getDrawList(activeProfileId));
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
