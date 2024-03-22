import { View, Text, StyleSheet, Pressable } from "react-native";
import { Trans } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import { isEmpty } from "lodash";
import { useState } from "react";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import SeparateLine from "../../../components/SeparateLine";
import { genTestId } from "../../../helper/AppHelper";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import { appConfig } from "../../../services/AppConfigService";

const ItemHeight = 160;

const styles = StyleSheet.create({
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: ItemHeight,
        borderRadius: DEFAULT_RADIUS,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginTop: 3,
        marginBottom: 15,
        marginHorizontal: DEFAULT_MARGIN,
    },
    cardTitle: {
        ...AppTheme.typography.card_title,
        marginBottom: 10,
    },
    cardBottomContainer: {
        flexDirection: "column",
        justifyContent: "center",
        height: 44,
        marginTop: 5,
    },
    tagDescription: {
        marginBottom: 5,
    },
    huntTagDescNameValue: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
    },
    licenseTag: {
        ...AppTheme.typography.hyperLink,
        color: AppTheme.colors.error,
    },
});

const renderValidDate = (date) => {
    return date ? (
        <View>
            <Text
                testID={genTestId(`date-${date}`)}
                style={{ ...AppTheme.typography.card_small_r, paddingTop: 5 }}
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

const renderReportStatus = (reportStatus) => {
    return reportStatus ? (
        <View>
            <Text
                testID={genTestId(`reportStatus`)}
                style={{ ...AppTheme.typography.card_small_r, paddingVertical: 2 }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {reportStatus}
            </Text>
        </View>
    ) : (
        <View />
    );
};

function CarouselContent({ item, index }) {
    const {
        altTextValidFromTo,
        name,
        huntTagDescription,
        mobileAppNeedPhysicalDocument,
        licenseReportConfirmationText,
    } = item;

    const [pressState, setPressState] = useState({});

    const renderTagDescription = () => {
        if (isEmpty(huntTagDescription)) {
            return (
                <View style={styles.tagDescription}>
                    <Text testID={genTestId("license")} style={{ ...AppTheme.typography.card_small_m }}>
                        <Trans i18nKey="license.license" />
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.tagDescription}>
                <Text testID={genTestId("TagDescName")} style={styles.huntTagDescNameValue}>
                    <Trans i18nKey="license.tagDescription" />
                </Text>
                <Text
                    testID={genTestId("TagDescValue")}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.huntTagDescNameValue}
                >
                    {huntTagDescription}
                </Text>
            </View>
        );
    };

    const renderLicenseTag = () => {
        if (mobileAppNeedPhysicalDocument) {
            return (
                <Text testID={genTestId("licenseTag")} style={styles.licenseTag}>
                    {appConfig.data.documentRequiredIndicator}
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.card}>
            <Pressable
                testID={genTestId("carouselItem")}
                style={{ height: "100%" }}
                onPressIn={(event) => {
                    // fix issue AWO-216369 [HFCA app] - When slide license card from home page, system direct user to license details.
                    console.log(`index:${index} start x:${event.nativeEvent.pageX}`);
                    console.log(`index:${index} start Y:${event.nativeEvent.pageY}`);
                    setPressState({
                        ...pressState,
                        [`${index}x`]: event.nativeEvent.pageX,
                        [`${index}y`]: event.nativeEvent.pageY,
                    });
                }}
                onPressOut={(event) => {
                    // fix issue AWO-216369 [HFCA app] - When slide license card from home page, system direct user to license details.
                    console.log(`index:${index} end x:${event.nativeEvent.pageX}`);
                    console.log(`index:${index} end Y:${event.nativeEvent.pageY}`);

                    let deltaX = Number.MAX_SAFE_INTEGER;
                    let deltaY = Number.MAX_SAFE_INTEGER;
                    if (event.nativeEvent.pageX) {
                        deltaX = event.nativeEvent.pageX - pressState[`${index}x`];
                    }
                    if (event.nativeEvent.pageY) {
                        deltaY = event.nativeEvent.pageY - pressState[`${index}y`];
                    }
                    console.log(`deltaX:${deltaX}`);
                    console.log(`deltaY:${deltaY}`);

                    if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
                        NavigationService.navigate(Routers.licenseDetail, { licenseId: item.id });
                    }
                }}
            >
                <Text testID={genTestId(`carouselItem-${name}`)} style={styles.cardTitle} numberOfLines={2}>
                    {name}
                </Text>
                {renderTagDescription()}
                <View style={{ flex: 1 }} />
                <SeparateLine style={{ marginHorizontal: -10 }} />
                <View style={styles.cardBottomContainer}>
                    {renderValidDate(altTextValidFromTo)}
                    {renderReportStatus(licenseReportConfirmationText)}
                    {renderLicenseTag()}
                </View>
            </Pressable>
        </View>
    );
}

function CarouseItem({ licenses, setActiveSlide }) {
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
            renderItem={({ item, index }) => {
                return <CarouselContent item={item} index={index} />;
            }}
            panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
            }}
        />
    );
}

export default CarouseItem;
