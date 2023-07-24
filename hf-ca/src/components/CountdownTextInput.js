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
    countdown: {
        flexDirection: "row",
        position: "absolute",
        alignContent: "center",
        right: 10,
    },
    errorMsg: {
        color: AppTheme.colors.error,
        marginTop: 5,
        ...AppTheme.typography.sub_section,
    },
    sendResendContainer: {
        alignSelf: "center",
    },
    sendResend: {
        color: AppTheme.colors.primary_2,
        ...AppTheme.typography.card_title,
    },
    sendResendDisable: {
        color: AppTheme.colors.font_color_3,
        ...AppTheme.typography.card_title,
    },
});

const CountdownTextInput = React.forwardRef((props, ref) => {
    const { initErrorObj = { error: false, errorMsg: undefined } } = props;
    const [focused, setFocused] = useState(false);
    const [errorObj, setErrorObj] = useState(initErrorObj);
    const hasError = errorObj.error;
    const {
        testID = "",
        value,
        label,
        hint,
        style,
        inputStyle,
        validate = () => errorObj,
        onChangeText,
        disabled,
        labelStyle,
        sendResend,
        onClickSendResend,
        onBlur,
        isShowCountdown,
        isShowResendCode,
        onCountdownFinish,
    } = props;

    let codeInputPaddingRight = 95;
    if (isShowCountdown) {
        codeInputPaddingRight = 155;
    } else if (isShowResendCode) {
        codeInputPaddingRight = 110;
    }

    useImperativeHandle(ref, () => ({
        setError: (obj) => {
            setErrorObj({ ...obj });
            return obj.error;
        },
    }));

    const renderCodeInputLabel = () => {
        return (
            <Text
                testID={genTestId(`${testID}InputLabel`)}
                style={[{ ...statefulStyle(styles.label, disabled, hasError) }, labelStyle]}
            >
                {label}
            </Text>
        );
    };

    const renderCodeInput = () => {
        return (
            <TextInput
                testID={genTestId(`${testID}Input`)}
                placeholder={hint}
                placeholderTextColor={AppTheme.colors.font_color_3}
                style={statefulStyle(
                    {
                        ...styles.inputStyle,
                        paddingRight: codeInputPaddingRight,
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
        );
    };

    const renderCountdown = () => {
        return (
            <View style={styles.countdown}>
                {isShowCountdown && (
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
                )}
                <Pressable
                    testID={genTestId(`${testID}SendResendButton`)}
                    onPress={onClickSendResend}
                    style={styles.sendResendContainer}
                    disabled={isShowCountdown}
                >
                    <Text
                        testID={genTestId(`${testID}SendResendLabel`)}
                        style={isShowCountdown ? styles.sendResendDisable : styles.sendResend}
                    >
                        {sendResend}
                    </Text>
                </Pressable>
            </View>
        );
    };

    const renderErrorMessage = () => {
        return (
            <View style={styles.messageContainer}>
                {hasError && (
                    <Text testID={genTestId(`${testID}ErrorMessage`)} style={styles.errorMsg}>
                        {errorObj.errorMsg}{" "}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { ...style }]}>
            {renderCodeInputLabel()}
            <View style={styles.inputContainer}>
                {renderCodeInput()}
                {renderCountdown()}
            </View>
            {renderErrorMessage()}
        </View>
    );
});

export default CountdownTextInput;
