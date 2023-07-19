import { isEmpty } from "lodash";
import { getWeatherDataByCityName, getWeatherData } from "../network/API";
import { KEY_CONSTANT } from "../constants/Constants";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { getCurrentLocation } from "./SalesAgentsService";
import AppContract from "../assets/_default/AppContract";

export default async function getWeatherDataFromService() {
    let weatherData = {};
    let apiRst = null;

    const coordinate = await retrieveItem(KEY_CONSTANT.keyLatLon);
    if (!isEmpty(coordinate)) {
        console.log("Weather service -- get weather data by saved coordinate");
        apiRst = await getWeatherData(coordinate[0], coordinate[1], 5);
        if (apiRst && apiRst?.success && !isEmpty(apiRst?.data?.forecast?.forecastday)) {
            weatherData = apiRst?.data;
        }
    } else {
        console.log("Weather service -- get current location coordinate");
        const result = await getCurrentLocation();
        if (result && result.success == true) {
            const location = result.value[0]?.center;
            if (location.length == 2) {
                const latitude = location[1];
                const longitude = location[0];
                await storeItem(KEY_CONSTANT.keyLatLon, [latitude, longitude]);
                console.log("Weather service -- get weather data by location coordinate");
                apiRst = await getWeatherData(latitude, longitude, 5);
                if (apiRst && apiRst?.success && !isEmpty(apiRst?.data?.forecast?.forecastday)) {
                    weatherData = apiRst?.data;
                }
            }
        } else {
            console.log("Weather service -- get weather data by city name");
            apiRst = await getWeatherDataByCityName(AppContract.weather.defaultCityName, 5);
            if (apiRst && apiRst?.success && !isEmpty(apiRst?.data?.forecast?.forecastday)) {
                weatherData = apiRst?.data;
            }
        }
    }
    return weatherData;
}
