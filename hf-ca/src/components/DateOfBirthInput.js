import React, { useRef } from "react";
import MaskInput, { Masks } from "react-native-mask-input";
import { StyleSheet, Text, View } from "react-native";
import { genTestId } from "../helper/AppHelper";
import { statefulStyle } from "../styles/CommonStyles";
import AppTheme from "../assets/_default/AppTheme";

const styles = StyleSheet.create({
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
    errorMsg: {
        color: AppTheme.colors.error,
        marginTop: 5,
        ...AppTheme.typography.sub_section,
    },
});

function DateOfBirthInput(props) {
    const {
        value,
        setValue,
        testID,
        label,
        disabled,
        style,
        labelStyle,
        inputStyle,
        onValidate = () => {},
        mask = Masks.DATE_MMDDYYYY,
        keyboardType = "numeric",
        errorMsg,
        setErrorMsg = () => {},
    } = props;

    const focused = useRef(false);

    return (
        <View style={{ flexDirection: "column", ...style }}>
            <Text
                testID={genTestId(`${testID}InputLabel`)}
                style={[{ ...statefulStyle(styles.label, disabled, !!errorMsg) }, labelStyle]}
            >
                {label}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaskInput
                    value={value}
                    onChangeText={(masked) => {
                        setErrorMsg("");
                        if (setValue) {
                            setValue(masked);
                        }
                    }}
                    mask={mask}
                    keyboardType={keyboardType}
                    maskAutoComplete
                    style={statefulStyle(
                        {
                            ...styles.inputStyle,
                            ...inputStyle,
                        },
                        disabled,
                        !!errorMsg,
                        focused.current
                    )}
                    onFocus={() => {
                        focused.current = true;
                    }}
                    onBlur={() => {
                        focused.current = false;
                        onValidate(value);
                    }}
                    editable={!disabled}
                />
            </View>
            {!!errorMsg && (
                <Text testID={genTestId(`${testID}InputErrorMsg`)} style={styles.errorMsg}>
                    {errorMsg}{" "}
                </Text>
            )}
        </View>
    );
}

export default DateOfBirthInput;
