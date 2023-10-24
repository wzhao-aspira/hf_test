import { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons/faAngleRight";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons/faAngleLeft";

import { useTranslation, Trans } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Page from "../../../components/Page";
import CommonHeader from "../../../components/CommonHeader";
import NotificationAndAttachment from "../../../components/notificationAndAttachment/NotificationAndAttachment";

import { genTestId } from "../../../helper/AppHelper";

import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../../constants/Dimension";

import type { AppNativeStackScreenProps } from "../../../constants/Routers";
import type { DrawApplicationItem as DrawApplicationItemData } from "../../../types/drawApplication";

import formatDrawApplicationChoices from "./utils/formatDrawApplicationChoices";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    scrollView: {
        width: "100%",
        height: "100%",
    },
    positionInfo: {
        marginHorizontal: DEFAULT_MARGIN + 4,
    },
    positionInfoText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    content: {
        marginHorizontal: DEFAULT_MARGIN + 5,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingTop: 6,
        paddingBottom: 12,
        borderRadius: 14,
        marginVertical: 6,
        height: "97%",
    },
    labelValueRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: DEFAULT_MARGIN - 10,
        borderColor: AppTheme.colors.divider,
        alignItems: "center",
    },
    labelText: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        fontSize: 14,
        minWidth: "40%",
    },
    valueText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        flex: 1,
        flexWrap: "wrap",
    },
});

interface DrawApplicationItemProps {
    item: DrawApplicationItemData;
    index: number;
    totalNumberOfTheChoices: number;
    isActive: boolean;
}

export const folderName = "draw_application_files";

function DrawApplicationItem(props: DrawApplicationItemProps) {
    const { item, index, totalNumberOfTheChoices, isActive } = props;
    const {
        type,
        status,
        partNumber,
        choiceNumber,
        choiceCode,
        name,
        didIWin,
        alternateNumber,
        isGeneratedDraw,
        members,
        huntDate,
        reservationNumber,
    } = item;

    const { t } = useTranslation();

    const shouldShowLeftAngle = isActive && index > 0;
    const shouldShowRightAngle = isActive && index < totalNumberOfTheChoices - 1;

    const labelValueList = isGeneratedDraw
        ? [
              { label: t("drawApplicationDetail.DrawType"), value: type },
              { label: t("drawApplicationDetail.DrawStatus"), value: status },
              { label: t("drawApplicationDetail.HuntName"), value: name },
              { label: t("drawApplicationDetail.HuntDate"), value: huntDate },
              { label: t("drawApplicationDetail.ReservationNumber"), value: reservationNumber },
              {
                  label: t("drawApplicationDetail.DidIWin"),
                  value: didIWin,
              },
          ]
        : [
              { label: t("drawApplicationDetail.DrawType"), value: type },
              { label: t("drawApplicationDetail.DrawStatus"), value: status },
              {
                  label: t("drawApplicationDetail.Party#Members"),
                  value: `${partNumber}${members?.reduce((previousValue, currentValue) => {
                      return `${previousValue}\n${currentValue}`;
                  }, "")}`,
              },
              {
                  label: t("drawApplicationDetail.Choice#"),
                  value: choiceNumber,
              },
              {
                  label: t("drawApplicationDetail.ChoiceCode"),
                  value: choiceCode,
              },
              {
                  label: t("drawApplicationDetail.ChoiceName"),
                  value: name,
              },
              {
                  label: t("drawApplicationDetail.DidIWin"),
                  value: didIWin,
              },
              {
                  label: t("drawApplicationDetail.Alternate#"),
                  value: alternateNumber,
              },
          ];

    return (
        <>
            {shouldShowLeftAngle && (
                <FontAwesomeIcon
                    style={{
                        position: "absolute",
                        top: "48%",
                        left: 13,
                    }}
                    icon={faAngleLeft}
                    size={20}
                />
            )}
            {shouldShowRightAngle && (
                <FontAwesomeIcon
                    style={{
                        position: "absolute",
                        top: "48%",
                        right: 13,
                    }}
                    icon={faAngleRight}
                    size={20}
                />
            )}
            <View style={[styles.content]}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} overScrollMode="never">
                    {labelValueList.map((labelValue) => {
                        return (
                            <View key={labelValue.label} style={styles.labelValueRow}>
                                <Text style={styles.labelText}>{labelValue.label}</Text>
                                <Text style={styles.valueText}>{labelValue.value}</Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </>
    );
}

interface DrawApplicationDetailScreenProps extends AppNativeStackScreenProps<"drawApplicationDetailScreen"> {
    //
}

function DrawApplicationDetailScreen(props: DrawApplicationDetailScreenProps) {
    const { route } = props;
    const { drawApplicationDetailData } = route.params;
    const { title, DrawApplicationChoices, isGeneratedDraw } = drawApplicationDetailData;

    const { filteredDrawApplicationChoices, fileList } = formatDrawApplicationChoices(DrawApplicationChoices);
    const totalNumberOfTheChoices = filteredDrawApplicationChoices?.length;

    const safeAreaInsets = useSafeAreaInsets();

    const [activeItemNumber, setActiveItemNumber] = useState(0);

    return (
        <Page style={styles.container}>
            <CommonHeader title={title} rightIcon={false} subTitle={null} />
            {totalNumberOfTheChoices > 0 && (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{
                        paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM - 10,
                    }}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                >
                    <View
                        style={{
                            marginTop: 15,
                        }}
                    />
                    {totalNumberOfTheChoices > 1 && (
                        <View style={styles.positionInfo}>
                            <Text style={styles.positionInfoText}>
                                <Trans
                                    i18nKey="drawApplicationDetail.of"
                                    tOptions={{
                                        position: activeItemNumber + 1,
                                        totalNumber: totalNumberOfTheChoices,
                                    }}
                                />
                            </Text>
                        </View>
                    )}
                    <Carousel
                        testID={genTestId("drawApplicationDetailScreenCarousel")}
                        width={SCREEN_WIDTH}
                        data={filteredDrawApplicationChoices}
                        height={isGeneratedDraw ? 300 : 400}
                        renderItem={({ item, index }) => {
                            return (
                                <DrawApplicationItem
                                    item={item}
                                    index={index}
                                    totalNumberOfTheChoices={totalNumberOfTheChoices}
                                    isActive={index === activeItemNumber}
                                />
                            );
                        }}
                        loop={false}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 1,
                            parallaxAdjacentItemScale: 1,
                            parallaxScrollingOffset: 45,
                        }}
                        onSnapToItem={(itemNumber) => setActiveItemNumber(itemNumber)}
                        panGestureHandlerProps={{
                            activeOffsetX: [-10, 10],
                        }}
                    />
                    {fileList.map((item) => (
                        <NotificationAndAttachment
                            key={item[0].id}
                            folderName={folderName}
                            fileInfoList={item}
                            cardMarginHorizontal={DEFAULT_MARGIN + 5}
                        />
                    ))}
                </ScrollView>
            )}
        </Page>
    );
}

export default DrawApplicationDetailScreen;
