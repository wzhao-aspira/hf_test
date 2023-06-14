import request from "./AxiosClient";
import AppContract from "../assets/_default/AppContract";

const LOCAL_RESOURCE = "owp-webclient/data/intl/locales/en-US.json";

export async function getConfig1() {
    const result = await request(LOCAL_RESOURCE);
    return result;
}

export async function getConfig() {
    const result = await request("https://postman-echo.com/get");
    return result;
}

export async function getWeatherData(latitude, longitude, days) {
    const urlStr = `https://api.weatherapi.com/v1/forecast.json?key=${AppContract.weather.apiKey}&q=${latitude},${longitude}&days=${days}&aqi=no&alerts=no`;
    return request(urlStr);
}

export async function getWeatherDataByCityName(cityName, days) {
    const urlStr = `https://api.weatherapi.com/v1/forecast.json?key=${AppContract.weather.apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`;
    return request(urlStr);
}

export function getCurrentLocationByText(text) {
    const result = { success: false };
    const urlStr = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${AppContract.mapBoxAccessToken}`;
    const response = request(urlStr);
    if (response.success) {
        const { features } = response;
        const suggestions = [];
        if (features && features.length > 0) {
            suggestions.push({ text: features[0].place_name, center: features[0].center });
            result.success = true;
            result.value = suggestions;
        } else {
            result.success = false;
        }
    }
    return result;
}
