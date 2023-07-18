import { FlatList, Keyboard, Pressable, Text, TextInput, View, Linking, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useCallback, useRef, useState } from "react";
import { isEmpty, debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocation } from "@fortawesome/pro-regular-svg-icons";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import * as IntentLauncherAndroid from "expo-intent-launcher";
import { genTestId, isIos } from "../helper/AppHelper";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { getCurrentLocation, searchLocationByText } from "../helper/LocationHelper";
import { SUGGESTED_LOCATIONS } from "../constants/Constants";
import DialogHelper from "../helper/DialogHelper";

const styles = StyleSheet.create({
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
    dropDownContainer: {
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
    rowText: {
        ...AppTheme.typography.sub_section,
        paddingVertical: 15,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        paddingHorizontal: 16,
    },
});

export default function LocationSearchInput(props) {
    const { testID = "", placeholder, onItemPressAction } = props;

    const { t } = useTranslation();

    const [value, setValue] = useState("");
    const [dropdownData, setDropdownData] = useState([]);
    const inputEl = useRef(null);

    const onSearch = async (text) => {
        if (isEmpty(text.trim())) {
            setDropdownData([]);
            return;
        }
        const searchResult = await searchLocationByText(text);
        if (searchResult.success) {
            const locations = searchResult.value;
            if (isEmpty(locations)) {
                setDropdownData([]);
            } else {
                setDropdownData(locations.filter((ele) => ele.text != SUGGESTED_LOCATIONS));
            }
        } else {
            const { title, message } = searchResult;
            DialogHelper.showSimpleDialog({
                title,
                message,
            });
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = useCallback(debounce(onSearch, 500), []);

    const onChangeText = (text) => {
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
            inputEl?.current?.focus();
            await onChangeText(searchResult.value[0].text);
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
                            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
                        ).catch((error) => {
                            console.log(`StartActivityAsync Error:${error}`);
                        });
                    }
                },
            });
        }
    };

    const renderDropDownItem = (item) => {
        return (
            <Pressable
                testID={genTestId(`${testID}LocationItemButton`)}
                onPress={() => {
                    Keyboard.dismiss();
                    setValue(item.text);
                    if (onItemPressAction) {
                        onItemPressAction(item);
                    }
                }}
            >
                <View style={styles.dropDownItem}>
                    <Text testID={genTestId(`${testID}LocationItemLabel`)} style={styles.rowText}>
                        {item.text}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <>
            <View style={styles.searchBarContainer}>
                <TextInput
                    testID={genTestId(`${testID}LocationInput`)}
                    placeholder={t(placeholder)}
                    onChangeText={(text) => onChangeText(text)}
                    placeholderTextColor={AppTheme.colors.font_color_3}
                    value={value}
                    ref={inputEl}
                    style={[styles.textInput, isEmpty(dropdownData) ? null : styles.textInputWithSearchData]}
                    onFocus={() => {}}
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
                style={{ flex: 1 }}
                onPress={() => {
                    Keyboard.dismiss();
                    setDropdownData([]);
                }}
            >
                <View>
                    {!isEmpty(dropdownData) && (
                        <FlatList
                            style={styles.dropDownContainer}
                            onScrollBeginDrag={() => {
                                Keyboard.dismiss();
                            }}
                            data={dropdownData}
                            renderItem={({ item }) => {
                                return renderDropDownItem(item);
                            }}
                            keyExtractor={(item, index) => `${item}${index}`}
                        />
                    )}
                </View>
            </Pressable>
        </>
    );
}
