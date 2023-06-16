import React, { useState, useImperativeHandle } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { statefulStyle } from "../styles/CommonStyles";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
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
    note: {
        flexDirection: "row",
        flexGrow: 1,
        color: AppTheme.colors.primary_2,
        marginTop: 5,
        ...AppTheme.typography.card_title,
        textAlign: "right",
    },
    helpText: {
        marginTop: 5,
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
    showPass: { position: "absolute", right: 10 },
    showPassText: {
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_2,
    },
    inputStyle: {
        width: "100%",
        height: 52,
        margin: 0,
        color: AppTheme.colors.font_color_1,
        ...AppTheme.typography.sub_section,
        borderWidth: 1,
        borderColor: AppTheme.colors.font_color_2,
        borderRadius: 3,
        paddingHorizontal: 10,
    },
});

const StatefulTextInput = React.forwardRef((props, ref) => {
    const { initErrorObj = { error: false, errorMsg: undefined } } = props;
    const [focused, setFocused] = useState(false);
    const [errorObj, setErrorObj] = useState(initErrorObj);
    const hasError = errorObj.error;
    const {
        value,
        label,
        hint,
        helpText,
        style,
        inputStyle,
        validate = () => errorObj,
        onChangeText,
        disabled,
        inputProps,
        keyboardType,
        helpTextStyle,
        onClickHelpText,
        display = true,
        password = false,
        autoCapitalize = "words",
        multiline = false,
        autogrow = false,
        autoComplete,
        labelStyle,
        note,
        onClickNote,
        onBlur,
    } = props;

    const [secureTextEntry, setSecureTextEntry] = useState(password);
    const showPassLabel = secureTextEntry ? "Show" : "Hide";
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
        <View style={[styles.container, { ...style }]}>
            <Text
                testID={genTestId(`${label}InputLabel`)}
                style={[{ ...statefulStyle(styles.label, disabled, hasError) }, labelStyle]}
            >
                {label}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    testID={genTestId(`${label}Input`)}
                    autoComplete={autoComplete}
                    autogrow={autogrow}
                    multiline={multiline}
                    // https://github.com/facebook/react-native/issues/30148#issuecomment-748288773
                    autoCapitalize={password ? "none" : autoCapitalize}
                    placeholder={hint}
                    placeholderTextColor={AppTheme.colors.font_color_3}
                    style={statefulStyle(
                        {
                            ...styles.inputStyle,
                            paddingRight: password ? 60 : 0,
                            ...inputStyle,
                        },
                        disabled,
                        hasError,
                        focused
                    )}
                    onChangeText={(text) => {
                        setErrorObj(validate(text));
                        onChangeText(text);
                    }}
                    value={value}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        onBlur && onBlur();
                    }}
                    editable={!disabled}
                    {...inputProps}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                />
                {password && (
                    <Pressable
                        testID={genTestId(`${label}InputSecureSwitchingButton`)}
                        style={styles.showPass}
                        onPress={() => {
                            if (password) {
                                setSecureTextEntry(!secureTextEntry);
                            }
                        }}
                    >
                        <Text testID={genTestId(`${label}InputSecureSwitchingText`)} style={styles.showPassText}>
                            {showPassLabel}
                        </Text>
                    </Pressable>
                )}
            </View>
            {helpText && (
                <Pressable
                    testID={genTestId(`${label}InputHelpButton`)}
                    onPress={() => onClickHelpText && onClickHelpText()}
                >
                    <Text
                        testID={genTestId(`${label}InputHelpText`)}
                        style={statefulStyle({ ...styles.helpText, ...helpTextStyle }, disabled, hasError)}
                    >
                        {helpText}
                    </Text>
                </Pressable>
            )}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {hasError && (
                    <Text testID={genTestId(`${label}InputErrorMsg`)} style={styles.errorMsg}>
                        {errorObj.errorMsg}{" "}
                    </Text>
                )}
                {note && (
                    <Pressable testID={genTestId(`${label}InputNoteButton`)} onPress={onClickNote} style={styles.note}>
                        <Text testID={genTestId(`${label}InputNoteText`)} style={styles.note}>
                            {note}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
});

export default StatefulTextInput;
