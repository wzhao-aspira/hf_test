import { View, Text, StyleSheet, Pressable } from "react-native";
import { Trans } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import SeparateLine from "../../../components/SeparateLine";
import { genTestId } from "../../../helper/AppHelper";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";

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
        paddingTop: 20,
        height: 44,
    },
});

const renderValidDate = (date) => {
    return date ? (
        <View>
            <Text
                testID={genTestId(`date-${date}`)}
                style={{ ...AppTheme.typography.card_small_r }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {date}
            </Text>
        </View>
    ) : (
        <View />
    );
};

function CarouselContent({ item }) {
    const { altTextValidFromTo, name } = item;
    return (
        <View style={styles.card}>
            <Pressable
                testID={genTestId("carouselItem")}
                style={{ height: "100%" }}
                onPress={() => {
                    NavigationService.navigate(Routers.licenseDetail, { licenseData: item });
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
                <View style={styles.cardBottomContainer}>{renderValidDate(altTextValidFromTo)}</View>
            </Pressable>
        </View>
    );
}

function CarouseItem({ licenses, setActiveSlide }) {
    return (
        <Carousel
            testID={genTestId("xarousel")}
            key={licenses.length}
            style={{
                marginHorizontal: -DEFAULT_MARGIN,
                alignSelf: "center",
            }}
            modeConfig={{
                parallaxScrollingScale: 1,
                parallaxAdjacentItemScale: 0.9,
                parallaxScrollingOffset: 60,
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
}

export default CarouseItem;
