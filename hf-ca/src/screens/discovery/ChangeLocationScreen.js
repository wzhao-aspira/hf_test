import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import LocationSearchInput from "../../components/LocationSearchInput";
import { storeItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";
import { getWeatherDataFromRedux } from "../../redux/WeatherSlice";
import NavigationService from "../../navigation/NavigationService";

export default function ChangeLocationScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onItemPressAction = async (location) => {
        if (isEmpty(location)) return;
        await storeItem(KEY_CONSTANT.keyLatLon, [location.center[1], location.center[0]]);
        dispatch(getWeatherDataFromRedux({ isForce: true }));
        NavigationService.back();
    };

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("discovery.changeLocation")} />
            <LocationSearchInput placeholder="discovery.searchByCityOrZip" onItemPressAction={onItemPressAction} />
        </View>
    );
}
