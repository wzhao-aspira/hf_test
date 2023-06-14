import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { faMoon, faSun } from "@fortawesome/pro-light-svg-icons";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import AppContract from "../../assets/_default/AppContract";
import CommonHeader from "../../components/CommonHeader";
import WeatherItem from "../../components/WeatherItem";
import SunriseItem from "../../components/SunriseItem";
import WeekItem from "../../components/WeekItem";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { REQUEST_STATUS } from "../../constants/Constants";
import WeatherCity from "../../components/WeatherCity";
import Page from "../../components/Page";
import { getWeatherDataFromRedux, weather } from "../../redux/WeatherSlice";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "column",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    weatherCityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: DEFAULT_MARGIN,
        paddingVertical: DEFAULT_MARGIN / 2,
    },
});

export default function SolunarScreen() {
    const dispatch = useDispatch();
    const weatherFromRedux = useSelector(weather);
    const { weatherData, requestStatus } = weatherFromRedux;

    const [forecast, setForecast] = useState({});
    const [weekNames, setWeekNames] = useState([]);
    const [selWeek, setSelWeek] = useState();

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, []);

    useEffect(() => {
        const tempWeek = [];
        for (let i = 0; i < weatherData?.forecast?.forecastday.length; i++) {
            const forecastday = weatherData?.forecast?.forecastday[i];
            const week = moment(forecastday.date).format(AppContract.dateFormats.dddd);
            tempWeek.push(week);
            if (i == 0) {
                setSelWeek(week);
                setForecast(forecastday);
            }
        }
        setWeekNames(tempWeek);
    }, [weatherData]);

    useEffect(() => {
        if (weatherData) {
            for (let i = 0; i < weatherData?.forecast?.forecastday.length; i++) {
                const forecastday = weatherData?.forecast?.forecastday[i];
                if (selWeek == moment(forecastday.date).format(AppContract.dateFormats.dddd)) {
                    setForecast(forecastday);
                }
            }
        }
    }, [selWeek]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={AppContract.strings.solunar} />
            <ScrollView
                testID={genTestId("SolunarContentScrollView")}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={requestStatus == REQUEST_STATUS.pending}
                        onRefresh={() => {
                            dispatch(getWeatherDataFromRedux({ isForce: true }));
                        }}
                    />
                }
            >
                <Page>
                    <View style={styles.headerContainer}>
                        <View style={styles.weatherCityContainer}>
                            <WeatherCity city={weatherData?.location?.name} />
                        </View>
                        <WeatherItem
                            title={forecast?.astro?.moon_illumination}
                            subTitle="%"
                            content={forecast?.astro?.moon_phase}
                        />
                        <WeekItem
                            selLabel={selWeek}
                            label={weekNames}
                            onPress={(value) => {
                                setSelWeek(value);
                            }}
                        />
                    </View>
                    <View>
                        <SunriseItem
                            title={AppContract.strings.sunrise_and_sunset}
                            leftLabel={AppContract.strings.sunrise}
                            leftValue={forecast?.astro?.sunrise}
                            icon={faSun}
                            rightLabel={AppContract.strings.sunset}
                            rightValue={forecast?.astro?.sunset}
                        />
                        <SunriseItem
                            title={AppContract.strings.moonrise_and_moonset}
                            leftLabel={AppContract.strings.moonrise}
                            leftValue={forecast?.astro?.moonrise}
                            icon={faMoon}
                            rightLabel={AppContract.strings.moonset}
                            rightValue={forecast?.astro?.moonset}
                        />
                    </View>
                </Page>
            </ScrollView>
        </View>
    );
}
