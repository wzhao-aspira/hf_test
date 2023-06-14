import React from "react";
import { StyleSheet, Modal, View, Text } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../constants/Dimension";
import PrimaryBtn from "./PrimaryBtn";

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: AppTheme.colors.backdrop,
    },
    contentStyle: {
        borderRadius: 10,
        width: SCREEN_WIDTH - DEFAULT_MARGIN * 2,
        backgroundColor: AppTheme.colors.page_bg,
        alignSelf: "center",
    },
    title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
        marginVertical: 10,
    },
    message: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_2,
        textAlign: "center",
        lineHeight: 20,
        marginVertical: 10,
    },
    okBtn: {
        margin: 10,
    },
});

// with one button
export const SimpleDialog = (props) => {
    const { title = "Alert", message = "Msg", visible = false, okText = "OK", okAction = () => {} } = props;
    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={styles.centeredView}>
                <View style={styles.contentStyle}>
                    <View style={{ padding: DEFAULT_MARGIN }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                        <PrimaryBtn onPress={okAction} label={okText} style={styles.okBtn} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
export const Dialog = (props) => {
    const { visible = false, children = <></> } = props;
    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={styles.centeredView}>
                <View style={styles.contentStyle}>{children}</View>
            </View>
        </Modal>
    );
};
