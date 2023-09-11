import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { faMap } from "@fortawesome/pro-regular-svg-icons/faMap";
import { faListAlt } from "@fortawesome/pro-regular-svg-icons/faListAlt";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isEmpty } from "lodash";
import openMap from "react-native-open-maps";
import AppTheme from "../../assets/_default/AppTheme";
import CommonHeader from "../../components/CommonHeader";
import SalesAgentsList from "./SalesAgentsList";
import LocationSearchInput from "../../components/LocationSearchInput";
import { insertSearchItem } from "../../helper/SalesAgentsHelper";
import profileSelectors from "../../redux/ProfileSelector";
import { genTestId, isIos } from "../../helper/AppHelper";
import SalesAgentsMap from "./SalesAgentsMap";
import DialogHelper from "../../helper/DialogHelper";
import { getSuggestionSalesAgentsFromService, getCurrentLocationWithoutPopup } from "../../services/SalesAgentsService";
import { SharedStyles } from "../../styles/CommonStyles";
import AppContract from "../../assets/_default/AppContract";
import { toggleIndicator } from "../../redux/AppSlice";
import { storeItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";

const displayEnum = {
    map: "map",
    list: "list",
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
    contentContainer: {
        flex: 1,
    },
    floatingBtnTouchArea: {
        flexDirection: "row",
        width: 143,
        justifyContent: "center",
        height: 50,
        alignItems: "center",
    },
    searchThisAreaBtn: {
        alignSelf: "center",
        position: "absolute",
        ...SharedStyles.floatingBtn,
        top: 170,
        height: 44,
        width: 152,
    },
});

export default function SalesAgentsScreen({ route }) {
    const { params = {} } = route;
    const { lastLocation = AppContract.weather.defaultCityGps } = params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const profileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const [display, setDisplay] = useState(displayEnum.map);
    const [mapCenter, setMapCenter] = useState(lastLocation);
    const [loading, setLoading] = useState(false);
    const [salesAgents, setSalesAgents] = useState();
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [selectIndex, setSelectIndex] = useState(-1);
    const searchCenter = useRef(null);
    const agentSearchInputRef = useRef();

    useEffect(() => {
        const getLocation = async () => {
            const res = await getCurrentLocationWithoutPopup();
            if (res.success) {
                const { value } = res;
                if (!isEmpty(value)) {
                    searchCenter.current = value[0]?.center;
                }
            } else {
                searchCenter.current = AppContract.weather.defaultCityGps;
            }
            storeItem(KEY_CONSTANT.keyLastLocation, searchCenter.current);
            setMapCenter(searchCenter.current);
        };
        getLocation();
    }, []);

    const toggleLoading = (open) => {
        if (display == displayEnum.list) {
            setLoading(open);
        } else {
            dispatch(toggleIndicator(open));
        }
    };

    const getSalesAgents = async (currentAgent) => {
        console.log(currentAgent);
        setShowSearch(false);
        toggleLoading(true);
        setShowFloatingButton(false);
        const searchResult = await getSuggestionSalesAgentsFromService(currentAgent.center);
        setSelectIndex(-1);
        if (searchResult.success) {
            setSalesAgents(searchResult.agents);
            setShowFloatingButton(searchResult.agents.length > 0);
            if (searchResult.agents.length == 0) {
                DialogHelper.showSimpleDialog({
                    title: "common.noResultsFound",
                    message: "errMsg.noResultsFoundMsg",
                    okText: "common.tryAgain",
                    okAction: () => {
                        setDisplay(displayEnum.map);
                    },
                });
            }
            if (searchResult.agents.length == 0) {
                setMapCenter(currentAgent.center);
            }
            if (searchResult.agents.length == 1) {
                setMapCenter(searchResult.agents[0].coor);
            }
        } else {
            DialogHelper.showSimpleDialog({
                title: "errMsg.commonErrorTitle",
                message: "errMsg.commonErrorMsg",
            });
        }
        toggleLoading(false);
    };

    const onClickCurrentLocationAction = async (currentAgent) => {
        getSalesAgents(currentAgent);
    };

    const onItemPressAction = async (item) => {
        await insertSearchItem(item, profileId);
        getSalesAgents(item);
    };

    const directToMap = (destination) => {
        openMap({
            start: agentSearchInputRef?.current?.text,
            end: destination,
            zoom: 20,
            provider: isIos() ? "apple" : "google",
        });
    };

    const onDirectionsClick = (item) => {
        if (!item) {
            return;
        }
        DialogHelper.showSelectDialog({
            title: "salesAgents.getDirectionsTitle",
            message: "salesAgents.getDirectionsMsg",
            okText: "salesAgents.openInMaps",
            cancelText: "common.cancel",
            okAction: () => {
                directToMap(`${item.address}, ${item.city}`);
            },
        });
    };

    const renderContentView = () => {
        return (
            <View style={styles.contentContainer}>
                {display == displayEnum.list && (
                    <SalesAgentsList
                        loading={loading}
                        salesAgents={salesAgents}
                        onDirectionsClick={(item) => {
                            onDirectionsClick(item);
                        }}
                    />
                )}
                {display == displayEnum.map && (
                    <SalesAgentsMap
                        mapCenter={mapCenter}
                        salesAgents={salesAgents}
                        onMapChange={(center) => {
                            console.log(center);
                            searchCenter.current = center;
                            setShowSearch(true);
                        }}
                        onSelectChange={setSelectIndex}
                        selectIndex={selectIndex}
                        onMapTouch={() => {
                            setSelectIndex(-1);
                        }}
                        onDirectionsClick={(item) => {
                            onDirectionsClick(item);
                        }}
                    />
                )}
            </View>
        );
    };

    const renderSearchBtn = () => {
        if (!showSearch) {
            return null;
        }
        return (
            <Pressable
                style={styles.searchThisAreaBtn}
                onPress={() => {
                    getSalesAgents({
                        center: searchCenter.current,
                    });
                }}
            >
                <Text style={SharedStyles.floatingBtnTitle}>{t("salesAgents.searchThisAres")}</Text>
            </Pressable>
        );
    };

    const renderFloatingBtn = () => {
        const title = display == displayEnum.map ? t("salesAgents.list") : t("salesAgents.map");
        const icon = display == displayEnum.map ? faListAlt : faMap;
        return (
            showFloatingButton && (
                <View
                    style={{
                        ...SharedStyles.floatingBtn,
                        position: "absolute",
                        bottom: 20,
                        alignSelf: "center",
                    }}
                >
                    <Pressable
                        testID={genTestId("FloatingButton")}
                        style={styles.floatingBtnTouchArea}
                        onPress={() => {
                            setDisplay(display != displayEnum.map ? displayEnum.map : displayEnum.list);
                            if (display == displayEnum.map) {
                                setShowSearch(false);
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            size={18}
                            style={{ marginRight: 10 }}
                            icon={icon}
                            color={AppTheme.colors.primary_2}
                        />
                        <Text testID={genTestId("FloatingButtonLabel")} style={SharedStyles.floatingBtnTitle}>
                            {title}
                        </Text>
                    </Pressable>
                </View>
            )
        );
    };

    return (
        <View style={styles.container}>
            <CommonHeader title={t("salesAgents.salesAgents")} />
            {renderContentView()}
            <LocationSearchInput
                ref={agentSearchInputRef}
                profileId={profileId}
                placeholder="salesAgents.searchForAgents"
                showRecent
                showDropdownAfterClickCurrentLocation={false}
                onClickCurrentLocationAction={onClickCurrentLocationAction}
                onItemPressAction={onItemPressAction}
                onFocus={() => {
                    setShowSearch(false);
                    setSelectIndex(-1);
                }}
            />
            {renderSearchBtn()}
            {renderFloatingBtn()}
        </View>
    );
}
