import { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

import Carousel from "react-native-reanimated-carousel";

import { useTranslation, Trans } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Page from "../../../components/Page";
import CommonHeader from "../../../components/CommonHeader";

import { genTestId } from "../../../helper/AppHelper";

import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../../constants/Dimension";

import type { AppNativeStackScreenProps } from "../../../constants/Routers";
import type { DrawApplicationItem as DrawApplicationItemData } from "../../../types/drawApplication";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    scrollView: {
        width: "100%",
        height: "100%",
    },
    positionInfo: {
        marginTop: 20,
        marginHorizontal: DEFAULT_MARGIN,
    },
    positionInfoText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    content: {
        marginTop: 6,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingTop: 6,
        paddingBottom: 32,
        borderRadius: 14,
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
}

function DrawApplicationItem(props: DrawApplicationItemProps) {
    const { item } = props;
    const { type, status, partNumber, choiceNumber, choiceCode, choiceName, didIWin, alternateNumber } = item;

    const safeAreaInsets = useSafeAreaInsets();

    // TODO: get from the en.json
    const labelValueList = [
        { label: "Draw Type:", value: type },
        { label: "Draw Status:", value: status },
        {
            label: `Party#/\nMembers:`,
            value: partNumber,
        },
        {
            label: "Choice #:",
            value: choiceNumber,
        },
        {
            label: "Choice Code:",
            value: choiceCode,
        },
        {
            label: "Choice Name:",
            value: choiceName,
        },
        {
            label: "Did I Win?",
            value: didIWin,
        },
        {
            label: "Alternate #",
            value: alternateNumber,
        },
    ].filter((labelValue) => !!labelValue.value);

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
                paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                {labelValueList.map((labelValue) => {
                    return (
                        <View key={labelValue.label} style={styles.labelValueRow}>
                            <Text style={styles.labelText}>{labelValue.label}</Text>
                            <Text style={styles.valueText}>{labelValue.value}</Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

// TODO: check is if content over the screen height

interface DrawApplicationDetailScreenProps extends AppNativeStackScreenProps<"drawApplicationDetailScreen"> {
    //
}

function DrawApplicationDetailScreen(props: DrawApplicationDetailScreenProps) {
    const { t } = useTranslation();

    const { route } = props;
    const { drawApplicationDetailData } = route.params;
    const totalNumberOfTheChoices = drawApplicationDetailData?.length;

    const [activeItemNumber, setActiveItemNumber] = useState(0);

    return (
        <Page style={styles.container}>
            <CommonHeader rightIcon={false} title={t("accessPermits.PermitDetails")} />
            {drawApplicationDetailData?.length > 0 && (
                <>
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
                    <Carousel
                        testID={genTestId("drawApplicationDetailScreenCarousel")}
                        width={SCREEN_WIDTH}
                        data={drawApplicationDetailData}
                        renderItem={({ item }) => {
                            return <DrawApplicationItem item={item} />;
                        }}
                        loop={false}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 1,
                            parallaxAdjacentItemScale: 1,
                            parallaxScrollingOffset: 43,
                        }}
                        onSnapToItem={(itemNumber) => setActiveItemNumber(itemNumber)}
                    />
                </>
            )}
        </Page>
    );
}

export default DrawApplicationDetailScreen;
