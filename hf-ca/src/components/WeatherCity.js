import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarker } from "@fortawesome/pro-solid-svg-icons";
import { faChevronDown } from "@fortawesome/pro-light-svg-icons";
import AppTheme from "../assets/_default/AppTheme";
import AppContract from "../assets/_default/AppContract";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    cityContainer: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: SCREEN_WIDTH - DEFAULT_MARGIN * 4 - 60,
    },
    city: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_2,
        paddingHorizontal: 3,
    },
});

export default function WeatherCity(props) {
    const { city } = props;
    const cityName = city || AppContract.weather.defaultCityName;
    return (
        <Pressable
            testID={genTestId("CitySwitchingButton")}
            onPress={() => {
                // NavigationService.navigate("ChangeLocScreen");
            }}
        >
            <View style={styles.cityContainer}>
                <FontAwesomeIcon icon={faMapMarker} size={14} color={AppTheme.colors.primary} />
                <Text testID={genTestId("CityNameLabel")} style={styles.city} numberOfLines={2}>
                    {cityName}
                </Text>
                <FontAwesomeIcon icon={faChevronDown} size={14} color={AppTheme.colors.primary_2} />
            </View>
        </Pressable>
    );
}
