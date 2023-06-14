import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { faCloudShowersHeavy, faCompass, faSun, faThermometerHalf } from "@fortawesome/pro-light-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import AppContract from "../../assets/_default/AppContract";
import CommonHeader from "../../components/CommonHeader";
import WeatherItem from "../../components/WeatherItem";
import SunriseItem from "../../components/SunriseItem";
import WeekItem from "../../components/WeekItem";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import WeatherCity from "../../components/WeatherCity";
import Page from "../../components/Page";
import { getWeatherDataFromRedux, weather, updateFahrenheitInd } from "../../redux/WeatherSlice";
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

export default function WeatherScreen() {
    const dispatch = useDispatch();
    const weatherFromRedux = useSelector(weather);
    const { weatherData, requestStatus, fahrenheitInd } = weatherFromRedux;

    let temperatureValue = fahrenheitInd ? weatherData?.current?.temp_f : weatherData?.current?.temp_c;
    if (temperatureValue === 0 || temperatureValue) {
        temperatureValue = `${Math.round(temperatureValue)}°`;
    }

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, []);

    const calPressure = () => {
        if (!isEmpty(weatherData?.forecast?.forecastday)) {
            const hours = weatherData?.forecast?.forecastday[0].hour;
            if (hours) {
                const tempHours = JSON.parse(JSON.stringify(hours));
                const sortedHours = tempHours.sort((a, b) => a.pressure_in - b.pressure_in);
                return [sortedHours[0].pressure_in, sortedHours[sortedHours.length - 1].pressure_in];
            }
        }
        return ["", ""];
    };

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={AppContract.strings.weather} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={requestStatus}
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
                            <SwitchSelector
                                testID={genTestId("fahrenheit_switching")}
                                accessibilityLabel={AppContract.accessibilityLabels.fahrenheit_switching}
                                onPress={(value) => {
                                    dispatch(updateFahrenheitInd(value));
                                }}
                                style={{ width: 60 }}
                                initial={fahrenheitInd ? 0 : 1}
                                height={24}
                                textColor={AppTheme.colors.font_color_4}
                                selectedColor={AppTheme.colors.primary_2}
                                buttonColor={AppTheme.colors.font_color_4}
                                borderColor={AppTheme.colors.primary_2}
                                hasPadding
                                valuePadding={1}
                                backgroundColor={AppTheme.colors.primary_2}
                                textStyle={AppTheme.typography.temperature_switch}
                                selectedTextStyle={AppTheme.typography.temperature_switch}
                                options={[
                                    { label: "°F", value: true },
                                    { label: "°C", value: false },
                                ]}
                            />
                        </View>
                        <WeatherItem title={temperatureValue} content={weatherData?.current?.condition?.text} />
                        <WeekItem label={[AppContract.strings.today]} />
                    </View>
                    <View>
                        <SunriseItem
                            title={AppContract.strings.sunrise_and_sunset}
                            leftLabel={AppContract.strings.sunrise}
                            leftValue={weatherData?.forecast?.forecastday[0]?.astro?.sunrise}
                            icon={faSun}
                            rightLabel={AppContract.strings.sunset}
                            rightValue={weatherData?.forecast?.forecastday[0]?.astro?.sunset}
                        />
                        <SunriseItem
                            title={AppContract.strings.wind}
                            leftLabel={AppContract.strings.speed}
                            leftValue={weatherData ? `${weatherData?.current?.wind_mph}mph` : ""}
                            icon={faCompass}
                            rightLabel={AppContract.strings.direction}
                            rightValue={weatherData?.current?.wind_dir}
                        />
                        <SunriseItem
                            title={AppContract.strings.precipitation}
                            leftLabel={AppContract.strings.type}
                            leftValue={AppContract.strings.rain}
                            icon={faCloudShowersHeavy}
                            rightLabel={AppContract.strings.probability}
                            rightValue={
                                weatherData?.forecast?.forecastday[0]
                                    ? `${weatherData?.forecast?.forecastday[0]?.day?.daily_chance_of_rain}%`
                                    : ""
                            }
                        />
                        <SunriseItem
                            title={AppContract.strings.barometric_pressure}
                            leftLabel={AppContract.strings.low}
                            leftValue={calPressure()[0]}
                            icon={faThermometerHalf}
                            rightLabel={AppContract.strings.high}
                            rightValue={calPressure()[1]}
                        />
                    </View>
                </Page>
            </ScrollView>
        </View>
    );
}
