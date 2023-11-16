import React, { useState, useImperativeHandle } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import { statefulStyle } from "../styles/CommonStyles";
import { genTestId, isIos } from "../helper/AppHelper";
import { DEFAULT_BTN_RADIUS } from "../constants/Dimension";

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
    countdownContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        paddingTop: 10,
    },
    didNotReceiveCode: {
        ...AppTheme.typography.overlay_sub_text,
        paddingRight: 10,
    },
    sendResendContainer: {
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.primary_2,
    },
    sendResendDisableContainer: {
        borderRadius: DEFAULT_BTN_RADIUS,
        backgroundColor: AppTheme.colors.font_color_3,
    },
    sendResendDisableButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    sendResendDisable: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
        paddingLeft: 15,
    },
    sendResend: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
        paddingHorizontal: 15,
        paddingVertical: 6,
    },
    countdownView: {
        paddingLeft: 2,
        paddingRight: 10,
    },
    errorMsg: {
        color: AppTheme.colors.error,
        marginTop: 5,
        ...AppTheme.typography.sub_section,
    },
});

const CountdownTextInput = React.forwardRef((props, ref) => {
    const { initErrorObj = { error: false, errorMsg: undefined } } = props;
    const [focused, setFocused] = useState(false);
    const [errorObj, setErrorObj] = useState(initErrorObj);
    const { t } = useTranslation();
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
        onCountdownFinish,
    } = props;

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
                keyboardType="ascii-capable"
                placeholder={hint}
                placeholderTextColor={AppTheme.colors.font_color_3}
                style={statefulStyle(
                    {
                        ...styles.inputStyle,
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
            <View style={isShowCountdown ? styles.sendResendDisableContainer : styles.sendResendContainer}>
                <Pressable
                    testID={genTestId(`${testID}SendResendButton`)}
                    style={isShowCountdown ? styles.sendResendDisableButton : null}
                    disabled={isShowCountdown}
                    onPress={onClickSendResend}
                >
                    <Text
                        testID={genTestId(`${testID}SendResendLabel`)}
                        style={isShowCountdown ? styles.sendResendDisable : styles.sendResend}
                    >
                        {sendResend}
                    </Text>
                    {isShowCountdown && (
                        <View style={styles.countdownView}>
                            <CountdownCircleTimer
                                isPlaying
                                duration={60}
                                colors={AppTheme.colors.font_color_4}
                                onComplete={onCountdownFinish}
                                size={isIos() ? 29 : 30.9}
                                strokeWidth={0}
                            >
                                {({ remainingTime, color }) => {
                                    let secStr = remainingTime;
                                    if (remainingTime < 10) {
                                        secStr = `0${secStr}`;
                                    } else if (remainingTime == 0) {
                                        secStr = "00";
                                    }
                                    return (
                                        <Text testID={genTestId(`${testID}Countdown`)} style={{ color, fontSize: 14 }}>
                                            {`${secStr}s`}
                                        </Text>
                                    );
                                }}
                            </CountdownCircleTimer>
                        </View>
                    )}
                </Pressable>
            </View>
        );
    };

    const renderCountdownContainer = () => {
        return (
            <View style={styles.countdownContainer}>
                <Text testID={genTestId(`${testID}DidNotReceiveCodeLabel`)} style={styles.didNotReceiveCode}>
                    {t("countdownTextInput.didNotReceiveCode")}
                </Text>
                {renderCountdown()}
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
            {renderCodeInput()}
            {renderCountdownContainer()}
            {renderErrorMessage()}
        </View>
    );
});

export default CountdownTextInput;
