import { t } from "i18next";
import CommonHeader from "../../components/CommonHeader";
import Page from "../../components/Page";
import { RefreshControl, StyleSheet, View, ScrollView } from "react-native";
import { MobileAppAlertListItem } from "./MobileAlertListItem";
import RefreshBar from "../../components/RefreshBar";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import NavigationService from "../../navigation/NavigationService";
import Routers, { useAppNavigation } from "../../constants/Routers";
import { genTestId } from "../../helper/AppHelper";
import AppTheme from "../../assets/_default/AppTheme";
import { selectMobileAppAlertListData } from "../../redux/MobileAppAlertSelector";
import { useDispatch, useSelector } from "react-redux";
import { getMobileAppAlert } from "../../redux/MobileAppAlertSlice";
import { LAST_UPDATE_TIME_DISPLAY_FORMAT } from "../../constants/Constants";
import useFocus from "../../hooks/useFocus";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppDispatch } from "../../redux/Store";
import moment from "moment";
import { MobileAppAlert } from "../../types/mobileAppAlert";
import { isEmpty } from "lodash";
import { EmptyContent } from "../shared/EmptyContent";

export const styles = StyleSheet.create({
    page: {
        paddingBottom: 0,
    },
    view: {
        paddingHorizontal: 5,
    },
    refreshBar: {
        marginHorizontal: DEFAULT_MARGIN,
        paddingVertical: 20,
    },
});

function onPress(mobileAppAlertId: number) {
    console.log(`CDFW Alerts list pressed id = ${mobileAppAlertId}`);
    NavigationService.navigate(Routers.mobileAlertDetail, { mobileAppAlertId });
}
function createSkeletonData(): MobileAppAlert[] {
    return [1, 2, 3, 4, 5].map((x) => {
        return {
            mobileAppAlertId: x,
            displayBeginDate: null,
            displayEndDate: null,
            isRead: true,
            message: null,
            needSynchronizeReadState: false,
            subject: null,
            readDate: null,
        } as MobileAppAlert;
    });
}
function MobileAlertsListScreen() {
    const headerTitle = t("mobileAlerts.listTitle");
    const mobileAppAlertData = useSelector(selectMobileAppAlertListData);
    const data = mobileAppAlertData?.data || [];
    const isShowSkeletonWhenOffline = mobileAppAlertData.isShowSkeletonWhenOffline;
    const skeletonData = createSkeletonData();
    const dispatch = useDispatch<AppDispatch>();
    const [isDataLoading, setIsDataLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const getData = async (isForce: boolean) => {
        setIsDataLoading(true);
        await dispatch(getMobileAppAlert({ isForce }));
        setIsDataLoading(false);
    };
    const isLoading = isDataLoading || isShowSkeletonWhenOffline;

    useFocus(() => {
        console.log(`MobileAlertsListScreen - getData - useFocus`);
        getData(false);
    });
    useEffect(() => {
        console.log(`MobileAlertsListScreen - getData - useEffect`);
        getData(false);
    }, []);

    const navigation = useAppNavigation();

    const refreshTimeDisplayValue = moment(mobileAppAlertData.lastUpdateTimeFromServer).format(
        LAST_UPDATE_TIME_DISPLAY_FORMAT
    );
    return (
        <Page style={styles.page}>
            <CommonHeader title={headerTitle} />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    marginTop: 14,
                    paddingBottom: insets.bottom + PAGE_MARGIN_BOTTOM,
                }}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={isLoading}
                        onRefresh={() => {
                            getData(true);
                        }}
                    />
                }
                testID={genTestId("mobileAppAlert")}
            >
                <View style={{ flex: 1 }}>
                    <RefreshBar
                        style={styles.refreshBar}
                        refreshTime={refreshTimeDisplayValue}
                        onRefresh={() => {
                            getData(true);
                        }}
                        isLoading={isLoading}
                    />
                    {!isLoading && isEmpty(data) && (
                        <EmptyContent
                            title={t("mobileAlerts.noAlertsTitle")}
                            subtitle={t("mobileAlerts.noAlertsIntroduction")}
                            showButton={true}
                            buttonText="Go Back"
                            onButtonPress={() => navigation.goBack()}
                        />
                    )}
                    {(isLoading ? skeletonData : data).map((x) => {
                        return (
                            <View key={x.mobileAppAlertId} style={styles.view}>
                                <MobileAppAlertListItem
                                    isLoading={isLoading}
                                    onpress={() => onPress(x.mobileAppAlertId)}
                                    mobileAppAlert={x}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </Page>
    );
}

export { MobileAlertsListScreen };
