import React, { useState, useImperativeHandle } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
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
    countdown: { position: "absolute", right: 10 },
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
    noteDisable: {
        flexDirection: "row",
        flexGrow: 1,
        color: AppTheme.colors.font_color_3,
        marginTop: 5,
        ...AppTheme.typography.card_title,
        textAlign: "right",
    },
});

const CountdownTextInput = React.forwardRef((props, ref) => {
    const { initErrorObj = { error: false, errorMsg: undefined } } = props;
    const [focused, setFocused] = useState(false);
    const [errorObj, setErrorObj] = useState(initErrorObj);
    const hasError = errorObj.error;
    const {
        testID,
        value,
        label,
        hint,
        style,
        inputStyle,
        validate = () => errorObj,
        onChangeText,
        disabled,
        labelStyle,
        note,
        onClickNote,
        onBlur,
        isShowCountdown,
        onCountdownFinish,
    } = props;

    useImperativeHandle(ref, () => ({
        setError: (obj) => {
            setErrorObj({ ...obj });
            return obj.error;
        },
    }));

    return (
        <View style={[styles.container, { ...style }]}>
            <Text
                testID={genTestId(`${testID}TextInputLabel`)}
                style={[{ ...statefulStyle(styles.label, disabled, hasError) }, labelStyle]}
            >
                {label}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    testID={genTestId(`${testID}TextInput`)}
                    placeholder={hint}
                    placeholderTextColor={AppTheme.colors.font_color_3}
                    style={statefulStyle(
                        {
                            ...styles.inputStyle,
                            paddingRight: isShowCountdown ? 60 : 0,
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
                        if (onBlur) {
                            onBlur();
                        }
                    }}
                />
                {isShowCountdown && (
                    <View style={styles.countdown}>
                        <CountdownCircleTimer
                            isPlaying
                            duration={60}
                            colors={AppTheme.colors.error}
                            onComplete={onCountdownFinish}
                            size={50}
                            strokeWidth={0}
                        >
                            {({ remainingTime, color }) => {
                                const minutes = Math.floor(remainingTime / 60);
                                const seconds = remainingTime % 60;
                                let minStr = minutes;
                                let secStr = seconds;
                                if (minutes < 10) {
                                    minStr = `0${minStr}`;
                                }
                                if (seconds < 10) {
                                    secStr = `0${secStr}`;
                                } else if (seconds == 0) {
                                    secStr = "00";
                                }
                                return (
                                    <Text testID={genTestId(`${testID}Countdown`)} style={{ color, fontSize: 15 }}>
                                        {minStr}:{secStr}
                                    </Text>
                                );
                            }}
                        </CountdownCircleTimer>
                    </View>
                )}
            </View>
            <View style={styles.messageContainer}>
                {hasError && (
                    <Text testID={genTestId(`${testID}TextInputErrorMessage`)} style={styles.errorMsg}>
                        {errorObj.errorMsg}{" "}
                    </Text>
                )}
                {note && (
                    <Pressable
                        testID={genTestId(`${testID}TextInputNoteButton`)}
                        onPress={onClickNote}
                        style={styles.note}
                        disabled={isShowCountdown}
                    >
                        <Text
                            testID={genTestId(`${testID}TextInputNoteText`)}
                            style={isShowCountdown ? styles.noteDisable : styles.note}
                        >
                            {note}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
});

export default CountdownTextInput;
