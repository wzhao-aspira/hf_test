import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import SeparateLine from "../../../components/SeparateLine";
import { genTestId } from "../../../helper/AppHelper";

const ItemHeight = 160;

const styles = StyleSheet.create({
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: ItemHeight,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginTop: 3,
        marginBottom: 15,
        marginHorizontal: DEFAULT_MARGIN,
    },
    cardTitle: {
        ...AppTheme.typography.card_title,
        marginBottom: 10,
    },
    cardBottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: 44,
    },
});

const renderValidDate = (title, date) => {
    return date ? (
        <View style={{ width: 100 }}>
            <Text testID={genTestId(`date-${title}`)} style={{ ...AppTheme.typography.card_small_m }}>
                {title}
            </Text>
            <Text testID={genTestId(`date-${date}`)} style={{ ...AppTheme.typography.card_small_r, marginTop: 5 }}>
                {date}
            </Text>
        </View>
    ) : (
        <View style={{ width: 100 }} />
    );
};

const CarouselContent = ({ item }) => {
    const { validFrom, validTo, name } = item;
    const { t } = useTranslation();
    return (
        <View style={styles.card}>
            <Pressable
                testID={genTestId("carouselItem")}
                style={{ height: "100%" }}
                onPress={() => {
                    console.log("navigate to license detail");
                }}
            >
                <Text testID={genTestId(`carouselItem-${name}`)} style={styles.cardTitle} numberOfLines={2}>
                    {name}
                </Text>
                <Text testID={genTestId("license")} style={{ ...AppTheme.typography.card_small_m }}>
                    <Trans i18nKey="license.license" />
                </Text>
                <View style={{ flex: 1 }} />
                <SeparateLine style={{ marginHorizontal: -20 }} />
                <View style={styles.cardBottomContainer}>
                    {renderValidDate(t("license.validFrom"), validFrom)}
                    {renderValidDate(t("license.validTo"), validTo)}
                </View>
            </Pressable>
        </View>
    );
};

const CarouseItem = ({ licenses, setActiveSlide }) => {
    return (
        <Carousel
            testID={genTestId("xarousel")}
            style={{
                marginHorizontal: -DEFAULT_MARGIN,
                alignSelf: "center",
            }}
            modeConfig={{
                parallaxScrollingScale: 1,
                parallaxAdjacentItemScale: 0.9,
                parallaxScrollingOffset: 10,
            }}
            loop={false}
            width={SCREEN_WIDTH}
            height={ItemHeight + 20}
            data={licenses}
            pagingEnabled
            mode="parallax"
            scrollAnimationDuration={100}
            onSnapToItem={(index) => {
                setActiveSlide(index);
            }}
            renderItem={({ item }) => {
                return <CarouselContent item={item} />;
            }}
            panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
            }}
        />
    );
};

export default CarouseItem;
