import { FlatList, Keyboard, Pressable, Text, TextInput, View, Linking, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { isEmpty, debounce } from "lodash";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocation } from "@fortawesome/pro-regular-svg-icons/faLocation";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";
import * as IntentLauncherAndroid from "expo-intent-launcher";
import { genTestId, isIos } from "../helper/AppHelper";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import getSalesAgentsSearchHistory from "../helper/SalesAgentsHelper";
import { SUGGESTED_LOCATIONS } from "../constants/Constants";
import { getCurrentLocation, searchLocationByText } from "../services/SalesAgentsService";
import DialogHelper from "../helper/DialogHelper";
import { handleError } from "../network/APIUtil";

const styles = StyleSheet.create({
    autocompleteContainer: {
        top: 65,
        position: "absolute",
        marginBottom: DEFAULT_MARGIN,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "center",
        marginHorizontal: DEFAULT_MARGIN,
    },
    textInput: {
        ...AppTheme.typography.sub_section,
        width: "100%",
        height: 56,
        marginTop: 20,
        alignContent: "center",
        borderColor: AppTheme.colors.primary_2,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: DEFAULT_MARGIN / 2,
        paddingRight: DEFAULT_MARGIN * 2,
        backgroundColor: AppTheme.colors.font_color_4,
    },
    textInputWithSearchData: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
    },
    searchIcon: {
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 0,
        top: 20,
    },
    dropDownList: {
        borderWidth: 1,
        borderColor: AppTheme.colors.primary_2,
        backgroundColor: AppTheme.colors.font_color_4,
        marginHorizontal: DEFAULT_MARGIN,
    },
    dropDownItem: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: AppTheme.colors.divider,
    },
    dropDownItemFistItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    dropDownFeedback: {
        width: "100%",
        height: "100%",
    },
    recentSearch: {
        ...AppTheme.typography.card_small_m,
        paddingTop: 10,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        paddingHorizontal: 16,
    },
    rowText: {
        ...AppTheme.typography.sub_section,
        paddingVertical: 15,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        paddingHorizontal: 16,
    },
});

const LocationSearchInput = React.forwardRef((props, ref) => {
    const {
        testID = "",
        profileId,
        placeholder,
        showRecent = false,
        showDropdownAfterClickCurrentLocation = true,
        onClickCurrentLocationAction,
        onItemPressAction,
        onFocus,
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    const [dropdownData, setDropdownData] = useState([]);
    const [recentDisplayed, setRecentDisplayed] = useState(false);

    const onSearch = async (text) => {
        if (isEmpty(text.trim())) {
            if (showRecent) {
                const recentSearch = [];
                const result = await getSalesAgentsSearchHistory(profileId);
                if (result) {
                    recentSearch.push({ text: t("salesAgents.recentSearch"), center: [] });
                    recentSearch.push(...result);
                }
                setDropdownData(recentSearch);
                setRecentDisplayed(true);
                return;
            }
            setDropdownData([]);
            return;
        }
        const searchResult = await handleError(searchLocationByText(text), { dispatch });
        if (searchResult.success) {
            const locations = searchResult.data.value;
            if (isEmpty(locations)) {
                setDropdownData([]);
            } else {
                setDropdownData(locations.filter((ele) => ele.text != SUGGESTED_LOCATIONS));
            }
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = useCallback(debounce(onSearch, 500), []);

    const onChangeText = async (text) => {
        setValue(text);
        debounceSearch(text);
    };

    const onClickCurrentLocation = async () => {
        if (!isEmpty(value?.trim())) {
            Keyboard.dismiss();
            setDropdownData([]);
            setValue();
            return;
        }
        const searchResult = await getCurrentLocation();
        if (searchResult.success) {
            if (showDropdownAfterClickCurrentLocation) {
                ref?.current?.focus();
                onChangeText(searchResult.value[0].text);
            } else {
                setValue(searchResult.value[0].text);
            }
            if (onClickCurrentLocationAction) {
                onClickCurrentLocationAction(searchResult.value[0]);
            }
        } else {
            DialogHelper.showSelectDialog({
                title: "location.locationAccessNeeded",
                message: "location.locationAccessNeededMsg",
                okText: "common.yes",
                cancelText: "common.no",
                okAction: () => {
                    if (isIos()) {
                        Linking.openURL("app-settings:");
                    } else {
                        IntentLauncherAndroid.startActivityAsync(
                            IntentLauncherAndroid.ActivityAction.LOCATION_SOURCE_SETTINGS
                        ).catch((error) => {
                            console.log(`StartActivityAsync Error:${error}`);
                        });
                    }
                },
            });
        }
    };

    const renderRecentSearch = (item) => {
        return (
            <View>
                <Text style={styles.recentSearch}>{item.text}</Text>
            </View>
        );
    };

    const renderItem = (item, itemStyle) => {
        return (
            <Pressable
                testID={genTestId(`${testID}LocationItemButton`)}
                onPress={() => {
                    Keyboard.dismiss();
                    setValue(item.text);
                    setDropdownData([]);
                    if (onItemPressAction) {
                        onItemPressAction(item);
                    }
                }}
            >
                <View style={itemStyle}>
                    <Text testID={genTestId(`${testID}LocationItemLabel`)} style={styles.rowText}>
                        {item.text}
                    </Text>
                </View>
            </Pressable>
        );
    };

    const renderDropDownItem = (item, index) => {
        if (showRecent && recentDisplayed) {
            if (index == 0) {
                return renderRecentSearch(item);
            }
            const itemStyle = index > 1 ? styles.dropDownItem : styles.dropDownItemFistItem;
            return renderItem(item, itemStyle);
        }
        return renderItem(item, styles.dropDownItem);
    };

    return (
        <View style={styles.autocompleteContainer}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    testID={genTestId(`${testID}LocationInput`)}
                    placeholder={t(placeholder)}
                    onChangeText={(text) => {
                        if (recentDisplayed) {
                            setRecentDisplayed(false);
                            setDropdownData([]);
                        }
                        onChangeText(text);
                    }}
                    placeholderTextColor={AppTheme.colors.font_color_3}
                    value={value}
                    ref={ref}
                    style={[styles.textInput, isEmpty(dropdownData) ? null : styles.textInputWithSearchData]}
                    onFocus={() => {
                        onChangeText("");
                        onFocus?.();
                    }}
                    onBlur={() => {}}
                />
                <Pressable
                    testID={genTestId(`${testID}CurrentLocationButton`)}
                    style={styles.searchIcon}
                    onPress={() => {
                        onClickCurrentLocation();
                    }}
                >
                    <FontAwesomeIcon
                        icon={isEmpty(value?.trim()) ? faLocation : faTimes}
                        size={28}
                        color={AppTheme.colors.primary_2}
                    />
                </Pressable>
            </View>
            <Pressable
                testID={genTestId(`${testID}LocationContainerButton`)}
                style={styles.dropDownFeedback}
                onPress={() => {
                    Keyboard.dismiss();
                    setDropdownData([]);
                }}
            >
                <View>
                    {!isEmpty(dropdownData) && (
                        <FlatList
                            style={styles.dropDownList}
                            onScrollBeginDrag={() => {
                                Keyboard.dismiss();
                            }}
                            data={dropdownData}
                            renderItem={({ item, index }) => {
                                return renderDropDownItem(item, index);
                            }}
                            keyExtractor={(item, index) => `${item}${index}`}
                        />
                    )}
                </View>
            </Pressable>
        </View>
    );
});

export default LocationSearchInput;
