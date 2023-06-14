import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { faLocationArrow } from "@fortawesome/pro-solid-svg-icons";
import { faSunrise, faSunset } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import moment from "moment";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import AppTheme from "../../assets/_default/AppTheme";
import AppContract from "../../assets/_default/AppContract";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../constants/Dimension";
import HomeStyles from "./HomeStyles";
import NavigationService from "../../navigation/NavigationService";
import { weather } from "../../redux/WeatherSlice";
import Routers from "../../constants/Routers";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        marginHorizontal: DEFAULT_MARGIN,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        ...AppTheme.shadow,
        flexDirection: "column",
        backgroundColor: AppTheme.colors.font_color_4,
        width: (SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 18) / 2,
        borderRadius: DEFAULT_RADIUS,
    },
    cardTitle: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        marginRight: 4,
    },
    bottomContainer: {
        height: 56,
        width: "100%",
        marginBottom: 0,
        borderTopColor: AppTheme.colors.page_bg,
        borderTopWidth: 1,
        alignSelf: "center",
        justifyContent: "center",
    },
    cardBottomLabel: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
    cityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
    },
    stateLabel: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        marginLeft: 20,
        marginBottom: 12,
        marginRight: 20,
    },
    sunContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    weatherContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        height: 60,
        alignItems: "center",
    },
    timeLabel: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginTop: 5,
        width: "100%",
    },
    sunSetRiseLabel: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        marginBottom: 12,
    },
    sunItem: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function HomeDiscoverySection() {
    const weatherFromRedux = useSelector(weather);
    const { weatherData, fahrenheitInd } = weatherFromRedux;

    const renderCity = (cityName) => {
        return (
            <View style={styles.cityContainer}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {cityName}
                </Text>
                <FontAwesomeIcon icon={faLocationArrow} size={8} color={AppTheme.colors.primary_2} />
            </View>
        );
    };

    const renderBottom = (value) => {
        return (
            <View style={styles.bottomContainer}>
                <Text style={styles.cardBottomLabel}>{value}</Text>
            </View>
        );
    };

    const renderWeatherCard = () => {
        const cityName = weatherData?.location?.name || AppContract.weather.defaultCityName;
        let tempF = fahrenheitInd ? weatherData?.current?.temp_f : weatherData?.current?.temp_c;
        if (tempF === 0) {
            tempF = "0";
        }
        const temperatureFlag = fahrenheitInd ? `° F` : `° C`;
        const tempFStr = tempF ? `${Math.round(tempF)}` : "-";
        const conditionText = weatherData?.current?.condition?.text || "-";
        return (
            <View style={styles.card}>
                <Pressable
                    testID={genTestId("weather_card")}
                    accessibilityLabel={AppContract.accessibilityLabels.weather_card}
                    style={{ height: "100%" }}
                    onPress={() => {
                        NavigationService.navigate(Routers.weather);
                    }}
                >
                    {renderCity(cityName)}
                    <View style={styles.weatherContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    ...AppTheme.typography.primary_heading,
                                    color: AppTheme.colors.font_color_1,
                                }}
                            >
                                {tempFStr}
                            </Text>
                            {tempF && <Text style={{ ...AppTheme.typography.section_header }}>{temperatureFlag}</Text>}
                        </View>
                    </View>
                    <Text style={styles.stateLabel} numberOfLines={1}>
                        {conditionText}
                    </Text>
                    {renderBottom(AppContract.strings.weather)}
                </Pressable>
            </View>
        );
    };

    const renderSolunarCard = () => {
        const cityName = weatherData?.location?.name || AppContract.weather.defaultCityName;
        const astro = weatherData?.forecast?.forecastday[0]?.astro;
        const sunrise = astro?.sunrise;
        const sunset = astro?.sunset;
        let formattedSunrise = "-";
        let formattedSunriseAmPm = "";
        let formattedSunset = "-";
        let formattedSunsetAmPm = "";
        if (!isEmpty(sunrise)) {
            formattedSunrise = moment(sunrise, AppContract.dateFormats.hh_ss_am_pm).format(
                AppContract.dateFormats.h_ss
            );
            formattedSunriseAmPm = moment(sunrise, AppContract.dateFormats.hh_ss_am_pm).format(
                AppContract.dateFormats.am_pm
            );
        }
        if (!isEmpty(sunset)) {
            formattedSunset = moment(sunset, AppContract.dateFormats.hh_ss_am_pm).format(AppContract.dateFormats.h_ss);
            formattedSunsetAmPm = moment(sunset, AppContract.dateFormats.hh_ss_am_pm).format(
                AppContract.dateFormats.am_pm
            );
        }
        return (
            <View style={styles.card}>
                <Pressable
                    testID={genTestId("solunar_card")}
                    accessibilityLabel={AppContract.accessibilityLabels.solunar_card}
                    style={{ height: "100%" }}
                    onPress={() => {
                        NavigationService.navigate(Routers.solunar);
                    }}
                >
                    {renderCity(cityName)}
                    <View style={styles.sunContainer}>
                        <View style={{ alignItems: "center" }}>
                            <View style={styles.sunItem}>
                                <FontAwesomeIcon icon={faSunrise} size={16} color={AppTheme.colors.primary_2} />
                                <Text numberOfLines={1} style={styles.timeLabel}>
                                    {formattedSunrise}{" "}
                                    <Text style={{ ...AppTheme.typography.am_pm }}>{formattedSunriseAmPm}</Text>
                                </Text>
                            </View>
                            <Text style={styles.sunSetRiseLabel}>{AppContract.strings.sunrise}</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <View style={styles.sunItem}>
                                <FontAwesomeIcon icon={faSunset} size={16} color={AppTheme.colors.primary_2} />
                                <Text numberOfLines={1} style={styles.timeLabel}>
                                    {formattedSunset}{" "}
                                    <Text style={{ ...AppTheme.typography.am_pm }}>{formattedSunsetAmPm}</Text>
                                </Text>
                            </View>
                            <Text style={styles.sunSetRiseLabel}>{AppContract.strings.sunset}</Text>
                        </View>
                    </View>
                    {renderBottom(AppContract.strings.solunar)}
                </Pressable>
            </View>
        );
    };

    return (
        <View>
            <View style={HomeStyles.sectionTitleContainer}>
                <Text style={HomeStyles.sectionTitle}>{AppContract.strings.discovery}</Text>
            </View>
            <View style={styles.cardContainer}>
                {renderWeatherCard()}
                {renderSolunarCard()}
            </View>
        </View>
    );
}
