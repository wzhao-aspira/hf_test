import { Trans } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRef, useState } from "react";
import { CarouselRenderItem, ICarouselInstance } from "react-native-reanimated-carousel/lib/typescript/types";
import { SCREEN_WIDTH } from "../constants/Dimension";
import AppTheme from "../assets/_default/AppTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons/faAngleRight";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons/faAngleLeft";

const styles = StyleSheet.create({
    container: {
        display: "flex",
    },
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 45,
        alignContent: "center",
        marginVertical: 10,
    },
    singleItem: {
        display: "flex",
        marginTop: 20,
    },
    positionInfoText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
});

/**
 * Raynor Chen @ April. 28th, 2024 This component is only for the detail screen / pages that needs a carousel experience.
 * For example, Draw result and Mobile App Alert.
 */
interface CarouselDetailProps<T> {
    data: T[];
    defaultIndex: number;
    carouselTitleTransKey?: string;
    carouselTitleFunc?: (position: number, totalNumber: number) => string;
    testId: string;
    renderItem: CarouselRenderItem<T>;
    /**
     * Specifies how many items rendered in initial loading.
     */
    windowSize?: number;
    onSnapToItem?: (itemIndex: number) => unknown;
}
export function CarouselDetail<T>(props: CarouselDetailProps<T>) {
    const carouselRef = useRef<ICarouselInstance>();

    const [activeItemNumber, setActiveItemNumber] = useState(props.defaultIndex);
    const shouldUseCarousel = props.data.length > 1;
    const hideLeftArrow = activeItemNumber === 0;
    const hideRightArrow = activeItemNumber === props.data.length - 1;
    const { transparent, font_color_1 } = AppTheme.colors;
    return (
        <View testID={props.testId} style={styles.container}>
            {shouldUseCarousel && (
                <View>
                    <View testID="carouselTitleBar" style={styles.title}>
                        <Pressable onPress={() => carouselRef.current?.prev()}>
                            <FontAwesomeIcon
                                color={hideLeftArrow ? transparent : font_color_1}
                                icon={faAngleLeft}
                                size={20}
                            />
                        </Pressable>

                        {props.carouselTitleTransKey && (
                            <Text style={styles.positionInfoText} testID="carouselTitle">
                                <Trans
                                    i18nKey={props.carouselTitleTransKey}
                                    tOptions={{
                                        position: activeItemNumber + 1,
                                        totalNumber: props.data.length,
                                    }}
                                />
                            </Text>
                        )}

                        {props.carouselTitleFunc && (
                            <Text style={styles.positionInfoText} testID="carouselTitle">
                                {props.carouselTitleFunc(activeItemNumber, props.data.length)}
                            </Text>
                        )}
                        <Pressable
                            onPress={() => {
                                carouselRef.current?.next();
                            }}
                        >
                            <FontAwesomeIcon
                                color={hideRightArrow ? transparent : font_color_1}
                                icon={faAngleRight}
                                size={20}
                            />
                        </Pressable>
                    </View>
                    <Carousel
                        windowSize={props.windowSize}
                        ref={carouselRef}
                        defaultIndex={props.defaultIndex}
                        testID={"carouselBody"}
                        width={SCREEN_WIDTH}
                        data={props.data}
                        renderItem={props.renderItem}
                        loop={false}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 1,
                            parallaxAdjacentItemScale: 1,
                            parallaxScrollingOffset: 45,
                        }}
                        onSnapToItem={(itemNumber) => {
                            setActiveItemNumber(itemNumber);
                            props.onSnapToItem?.(itemNumber);
                        }}
                        panGestureHandlerProps={{
                            activeOffsetX: [-10, 10],
                        }}
                    />
                </View>
            )}

            {!shouldUseCarousel && (
                <View testID="carousel_singleItem" style={styles.singleItem}>
                    {props.renderItem({
                        animationValue: { value: 0 },
                        index: 0,
                        item: props.data[0],
                    })}
                </View>
            )}
        </View>
    );
}
