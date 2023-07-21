import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useImperativeHandle, useState } from "react";
import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import color from "color";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../assets/_default/AppTheme";
import SVGIcon, { pathList } from "./SVGIcon";
import { Dialog } from "./Dialog";
import { genTestId } from "../helper/AppHelper";

const statefulStyle = (style, disabled, error, focused = false) => {
    let textColor = style.color;
    let { borderColor, borderWidth } = style;
    if (disabled) {
        if (textColor) {
            textColor = color(textColor).alpha(0.5).toString();
        }
        if (borderColor) {
            borderColor = color(textColor).alpha(0.5).toString();
        }
    }
    if (error) {
        if (borderColor) {
            borderColor = AppTheme.colors.error;
        }
        if (borderWidth) {
            borderWidth = 2;
        }
    }
    if (focused) {
        if (borderWidth) {
            borderWidth = 2;
        }
    }
    return {
        ...style,
        color: textColor,
        borderColor,
        borderWidth,
    };
};

const styles = StyleSheet.create({
    valueContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        justifyContent: "space-between",
        alignItems: "center",
        height: 52,
        borderRadius: 3,
        borderColor: AppTheme.colors.primary_2,
        borderWidth: 1,
    },
    optionContainer: {
        flexDirection: "row",
        borderBottomColor: AppTheme.colors.divider,
        borderBottomWidth: 1,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    value: {
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_1,
        flexShrink: 1,
    },

    label: {
        marginBottom: 5,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
    errorMsg: {
        color: AppTheme.colors.error,
        marginTop: 5,
        ...AppTheme.typography.sub_section,
    },
    helpText: {
        marginTop: 5,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_3,
    },
});

const PopupDropdown = React.forwardRef((props, ref) => {
    const {
        options,
        label,
        helpText,
        value = "Please Select",
        idName = "id",
        valueName = "name",
        onSelect,
        disabled = false,
        display = true,
        containerStyle,
        labelStyle,
        valueContainerStyle,
        testID,
    } = props;
    const [errorObj, setErrorObj] = useState({ error: false, errorMsg: undefined });
    const [popupVisible, setPopVisible] = useState(false);
    const hasError = errorObj.error;
    const hasValue = options?.indexOf(value) >= 0;

    useImperativeHandle(ref, () => ({
        setError: (obj) => {
            setErrorObj({ ...obj });
            return obj.error;
        },
    }));
    if (!display) {
        return null;
    }

    function RenderItem({ item, index }) {
        const selected = options[index][valueName] === value;
        return (
            <Pressable
                testID={genTestId(`${testID}ItemBtn`)}
                onPress={() => {
                    setPopVisible(false);
                    if (item[valueName] == value) {
                        return;
                    }
                    setErrorObj({ error: false });
                    if (onSelect) onSelect(index, item);
                }}
            >
                <View style={{ ...styles.optionContainer }}>
                    <Text testID={genTestId(`${testID}ItemIconValue`)} style={styles.value}>
                        {item[valueName]}
                    </Text>
                    <SVGIcon pathList={selected ? pathList.circleChecked : pathList.circleUnchecked} />
                </View>
            </Pressable>
        );
    }

    return (
        <View style={containerStyle}>
            {label && (
                <Text
                    testID={genTestId(`${testID}ItemValueLabel`)}
                    style={[statefulStyle(styles.label, disabled, hasError), labelStyle]}
                >
                    {label}
                </Text>
            )}
            <Pressable
                testID={genTestId(`${testID}Btn`)}
                onPress={() => {
                    if (disabled) {
                        return;
                    }
                    setPopVisible(true);
                }}
            >
                <View style={[statefulStyle(styles.valueContainer, disabled, hasError), valueContainerStyle]}>
                    <Text
                        testID={genTestId(`${testID}ItemValue`)}
                        style={[
                            statefulStyle(styles.value, disabled, hasError),
                            !hasValue ? { color: AppTheme.colors.font_color_2 } : {},
                        ]}
                    >
                        {value}
                    </Text>
                    <FontAwesomeIcon icon={faCaretDown} size={20} color={AppTheme.colors.primary_2} />
                </View>
            </Pressable>
            {!hasError && helpText && (
                <Text
                    testID={genTestId(`${testID}HelpText`)}
                    style={statefulStyle(styles.helpText, disabled, hasError)}
                >
                    {" "}
                    {helpText}{" "}
                </Text>
            )}
            {hasError && (
                <Text testID={genTestId(`${testID}ErrorMsg`)} style={styles.errorMsg}>
                    {" "}
                    {errorObj.errorMsg}{" "}
                </Text>
            )}
            <Dialog visible={popupVisible} closeModal={() => setPopVisible(false)}>
                <FlatList data={options} renderItem={RenderItem} keyExtractor={(item) => item[idName]} />
            </Dialog>
        </View>
    );
});

export default PopupDropdown;
