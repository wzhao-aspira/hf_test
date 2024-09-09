import { t } from "i18next";
import CommonHeader from "../../components/CommonHeader";
import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from "react-native";
import Page from "../../components/Page";
import { CarouselDetail } from "../../components/CarouselDetail";
import { genTestId } from "../../helper/AppHelper";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import { Trans } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { useSelector, useDispatch } from "react-redux";

import { selectMobileAppAlertListData } from "../../redux/MobileAppAlertSelector";
import { MobileAppAlert } from "../../types/mobileAppAlert";
import { DEFAULT_DATE_DISPLAY_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { markMobileAppAlertsAsRead } from "../../redux/MobileAppAlertSlice";
import { AppDispatch } from "../../redux/Store";

const styles = StyleSheet.create({
    screen: {
        paddingBottom: 240,
        display: "flex",
    },
    container: {
        marginHorizontal: DEFAULT_MARGIN + 5,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingTop: 6,
        paddingBottom: 10,
        borderRadius: 14,
        marginVertical: 6,
    },

    content: { height: "100%", padding: 20 },
    endDateContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    endDateText: {
        color: AppTheme.colors.font_color_3,
    },
    title: {
        ...AppTheme.typography.secondary_heading,
    },
    dateSent: {
        color: AppTheme.colors.font_color_3,
        marginBottom: 5,
    },
    textContent: {
        marginBottom: 20,
    },
});

interface MobileAlertDetailViewProps {
    mobileAppAlert: MobileAppAlert;
    isLoading: boolean;
}
function MobileAlertDetailView(prop: MobileAlertDetailViewProps) {
    const { width } = useWindowDimensions();
    const { mobileAppAlert } = prop;
    const displayBeginDate = moment(mobileAppAlert.displayBeginDate).format(DEFAULT_DATE_DISPLAY_FORMAT);
    const displayEndDate = moment(mobileAppAlert.displayEndDate).add(-1, "day").format(DEFAULT_DATE_DISPLAY_FORMAT);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView>
                    <Text
                        style={styles.title}
                        testID={genTestId("mobileAppAlertDetailSubject", mobileAppAlert.mobileAppAlertId)}
                    >
                        {mobileAppAlert.subject}
                    </Text>
                    <Text
                        style={styles.dateSent}
                        testID={genTestId("mobileAppAlertDetailDateSent", mobileAppAlert.mobileAppAlertId)}
                    >
                        Date Sent: {displayBeginDate}
                    </Text>
                    <View
                        style={styles.textContent}
                        testID={genTestId("mobileAppAlertDetailMessage", mobileAppAlert.mobileAppAlertId)}
                    >
                        <RenderHTML contentWidth={width} source={{ html: mobileAppAlert.message }} />
                    </View>
                </ScrollView>
                <View style={styles.endDateContainer}>
                    <Text
                        style={styles.endDateText}
                        testID={genTestId("mobileAppAlertDetailDisplayEndDate", mobileAppAlert.mobileAppAlertId)}
                    >
                        <Trans i18nKey={"mobileAlerts.messageDisplayUntil"} tOptions={{ displayEndDate }} />
                    </Text>
                </View>
            </View>
        </View>
    );
}

interface MobileAlertDetailScreenProp {
    mobileAppAlertId: number;
    route: any;
}

export function MobileAlertDetailScreen(props: MobileAlertDetailScreenProp) {
    const dispatch = useDispatch<AppDispatch>();

    const route = props.route;
    const mobileAppAlertId = route.params.mobileAppAlertId as number;
    const title = t("mobileAlerts.detailTitle");
    const mobileAppAlertData = useSelector(selectMobileAppAlertListData);
    const dataArr = mobileAppAlertData.data;
    const currentItemIndex = dataArr?.findIndex((x) => x.mobileAppAlertId == mobileAppAlertId);
    useEffect(() => {
        if (!dataArr[currentItemIndex].isRead) {
            dispatch(markMobileAppAlertsAsRead([{ mobileAppAlertId }]));
        }
    }, [mobileAppAlertId]);
    const [isLoading] = useState(false);

    return (
        <Page style={styles.screen}>
            <CommonHeader title={title} />
            <CarouselDetail
                defaultIndex={currentItemIndex}
                windowSize={3}
                testId={genTestId("mobileAppAlertDetail")}
                carouselTitleTransKey="mobileAlerts.of"
                data={dataArr}
                renderItem={(renderItemInfo) => {
                    return <MobileAlertDetailView isLoading={isLoading} mobileAppAlert={renderItemInfo.item} />;
                }}
                onSnapToItem={async (x) => {
                    if (!dataArr[x].isRead) {
                        await dispatch(markMobileAppAlertsAsRead([{ mobileAppAlertId: dataArr[x].mobileAppAlertId }]));
                    }
                }}
            />
        </Page>
    );
}
