import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useImperativeHandle, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import color from "color";
import { faCaretDown } from "@fortawesome/pro-light-svg-icons";
import AppTheme from "../assets/_default/AppTheme";
import SVGIcon, { pathList } from "./SVGIcon";
import { Dialog } from "./Dialog";

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
        defaultValue = "Please Select",
        onSelect,
        disabled = false,
        display = true,
        containerStyle,
        labelStyle,
        valueContainerStyle,
    } = props;
    const [errorObj, setErrorObj] = useState({ error: false, errorMsg: undefined });
    const [popupVisible, setPopVisible] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const hasError = errorObj.error;
    const hasValue = options?.indexOf(value) >= 0;

    useImperativeHandle(ref, () => ({
        setError: (obj) => {
            setErrorObj({ ...obj });
            return obj.error;
        },
        select: (index) => {
            console.log(`${index}:${defaultValue}`);
            if (index < 0) {
                setValue(defaultValue);
            } else {
                setValue(options[index]);
                onSelect(index, options[index]);
            }
        },
    }));
    if (!display) {
        return null;
    }

    const RenderItem = ({ item, index }) => {
        const selected = options.indexOf(value) == index;
        return (
            <Pressable
                onPress={() => {
                    setPopVisible(false);
                    if (item == value) {
                        return;
                    }
                    setValue(item);
                    setErrorObj({ error: false });
                    onSelect && onSelect(index, item);
                }}
            >
                <View style={{ ...styles.optionContainer }}>
                    <Text style={styles.value}>{item}</Text>
                    <SVGIcon pathList={selected ? pathList.circleChecked : pathList.circleUnchecked} />
                </View>
            </Pressable>
        );
    };

    return (
        <View style={containerStyle}>
            {label && <Text style={[statefulStyle(styles.label, disabled, hasError), labelStyle]}>{label}</Text>}
            <Pressable
                onPress={() => {
                    if (disabled) {
                        return;
                    }
                    setPopVisible(true);
                }}
            >
                <View style={[statefulStyle(styles.valueContainer, disabled, hasError), valueContainerStyle]}>
                    <Text
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
                <Text style={statefulStyle(styles.helpText, disabled, hasError)}> {helpText} </Text>
            )}
            {hasError && <Text style={styles.errorMsg}> {errorObj.errorMsg} </Text>}
            <Dialog visible={popupVisible}>
                <FlatList data={options} renderItem={RenderItem} keyExtractor={(item) => item.toString()} />
            </Dialog>
        </View>
    );
});

export default PopupDropdown;
