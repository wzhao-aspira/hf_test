import { useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { faCloudShowersHeavy } from "@fortawesome/pro-light-svg-icons/faCloudShowersHeavy";
import { faCompass } from "@fortawesome/pro-light-svg-icons/faCompass";
import { faSun } from "@fortawesome/pro-light-svg-icons/faSun";
import { faThermometerHalf } from "@fortawesome/pro-light-svg-icons/faThermometerHalf";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
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
import { REQUEST_STATUS } from "../../constants/Constants";

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
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const weatherFromRedux = useSelector(weather);
    const { weatherData, requestStatus, fahrenheitInd } = weatherFromRedux;

    let temperatureValue = fahrenheitInd ? weatherData?.current?.temp_f : weatherData?.current?.temp_c;
    if (temperatureValue === 0 || temperatureValue) {
        temperatureValue = `${Math.round(temperatureValue)}°`;
    }

    useEffect(() => {
        dispatch(getWeatherDataFromRedux({}));
    }, [dispatch]);

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
            <CommonHeader title={t("discovery.weather")} />
            <ScrollView
                testID={genTestId("WeatherContentScrollView")}
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
                            <SwitchSelector
                                testID={genTestId("FahrenheitSwitchingButton")}
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
                        <WeekItem label={[t("discovery.today")]} />
                    </View>
                    <View>
                        <SunriseItem
                            testID="WeatherSunriseAndSunset"
                            title={t("discovery.sunriseAndSunset")}
                            leftLabel={t("discovery.sunrise")}
                            leftValue={weatherData?.forecast?.forecastday[0]?.astro?.sunrise}
                            icon={faSun}
                            rightLabel={t("discovery.sunset")}
                            rightValue={weatherData?.forecast?.forecastday[0]?.astro?.sunset}
                        />
                        <SunriseItem
                            testID="WeatherWind"
                            title={t("discovery.wind")}
                            leftLabel={t("discovery.speed")}
                            leftValue={weatherData ? `${weatherData?.current?.wind_mph}mph` : ""}
                            icon={faCompass}
                            rightLabel={t("discovery.direction")}
                            rightValue={weatherData?.current?.wind_dir}
                        />
                        <SunriseItem
                            testID="WeatherPrecipitation"
                            title={t("discovery.precipitation")}
                            leftLabel={t("discovery.type")}
                            leftValue={t("discovery.rain")}
                            icon={faCloudShowersHeavy}
                            rightLabel={t("discovery.probability")}
                            rightValue={
                                weatherData?.forecast?.forecastday[0]
                                    ? `${weatherData?.forecast?.forecastday[0]?.day?.daily_chance_of_rain}%`
                                    : ""
                            }
                        />
                        <SunriseItem
                            testID="WeatherBarometricPressure"
                            title={t("discovery.barometricPressure")}
                            leftLabel={t("discovery.low")}
                            leftValue={calPressure()[0]}
                            icon={faThermometerHalf}
                            rightLabel={t("discovery.high")}
                            rightValue={calPressure()[1]}
                        />
                    </View>
                </Page>
            </ScrollView>
        </View>
    );
}
