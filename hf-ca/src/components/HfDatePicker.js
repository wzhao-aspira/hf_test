import React, { useImperativeHandle, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from "moment";
import color from "color";
import AppTheme from "../assets/_default/AppTheme";
import { genTestId } from "../helper/AppHelper";
import { DEFAULT_DATE_FORMAT } from "../constants/Constants";

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
    value: {
        height: 52,
        justifyContent: "center",
        borderRadius: 3,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_1,
        lineHeight: 50,
        paddingHorizontal: 10,
        borderColor: AppTheme.colors.primary_2,
        borderWidth: 1,
    },
    errorMsg: {
        color: AppTheme.colors.error,
        marginTop: 5,
        ...AppTheme.typography.sub_section,
    },
    helpText: {
        marginTop: 5,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
});

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

const HfDatePicker = React.forwardRef((props, ref) => {
    const { initErrorObj = { error: false, errorMsg: undefined } } = props;
    const [visible, setVisible] = useState(false);
    const [errorObj, setErrorObj] = useState(initErrorObj);

    const {
        value,
        valueFormat = DEFAULT_DATE_FORMAT,
        label,
        helpText,
        style,
        disabled,
        display = true,
        onConfirm,
        mode = "date",
        hint = DEFAULT_DATE_FORMAT,
        onCancel,
        validate = () => {
            return { error: false, errorMsg: "" };
        },
        labelStyle,
        valueContainerStyle,
        testID,
    } = props;
    const hasError = errorObj.error;
    useImperativeHandle(ref, () => ({
        setError: (obj) => {
            setErrorObj({ ...obj });
            return obj.error;
        },
    }));
    if (!display) {
        return null;
    }

    return (
        <View style={{ flexDirection: "column", ...style }}>
            {label && (
                <Text
                    testID={genTestId(`${testID}InputLabel`)}
                    style={[statefulStyle(styles.label, disabled, hasError), labelStyle]}
                >
                    {label}{" "}
                </Text>
            )}
            <Pressable
                testID={genTestId(`${testID}Btn`)}
                onPress={() => {
                    if (disabled) {
                        return;
                    }
                    setVisible(true);
                }}
            >
                <Text
                    testID={genTestId(`${testID}ValueOrHint`)}
                    style={[
                        statefulStyle(styles.value, disabled, hasError),
                        valueContainerStyle,
                        !value ? { color: AppTheme.colors.font_color_2 } : {},
                    ]}
                >
                    {value || hint}
                </Text>
            </Pressable>

            {!hasError && helpText && (
                <Text
                    testID={genTestId(`${testID}HelpText`)}
                    style={statefulStyle(styles.helpText, disabled, hasError)}
                >
                    {helpText}
                </Text>
            )}
            {hasError && (
                <Text testID={genTestId(`${testID}ErrorMsg`)} style={styles.errorMsg}>
                    {errorObj.errorMsg}{" "}
                </Text>
            )}
            <DateTimePickerModal
                testID={genTestId(`${testID}DateTimePicker`)}
                display="spinner"
                date={value ? moment(value, valueFormat).toDate() : new Date()}
                isVisible={visible}
                mode={mode}
                onConfirm={(date) => {
                    const dateStr = JSON.stringify(date);
                    setVisible(false);
                    setErrorObj({ ...validate(dateStr) });
                    onConfirm && onConfirm(date);
                }}
                onCancel={() => {
                    setVisible(false);
                    onCancel && onCancel();
                }}
            />
        </View>
    );
});

export default HfDatePicker;
