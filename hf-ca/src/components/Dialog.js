import React from "react";
import { StyleSheet, Modal, View, Text, ActivityIndicator, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/Dimension";
import PrimaryBtn from "./PrimaryBtn";
import OutlinedBtn from "./OutlinedBtn";

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: AppTheme.colors.backdrop,
    },
    contentStyle: {
        borderRadius: 10,
        width: SCREEN_WIDTH - DEFAULT_MARGIN * 2,
        backgroundColor: AppTheme.colors.font_color_4,
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
    cancelBtn: {
        marginTop: -10,
        marginBottom: 10,
        borderWidth: 0,
    },
});

// with one button
export const SimpleDialog = (props) => {
    const { t, i18n } = useTranslation();
    const {
        title = "common.alert",
        message = "common.message",
        visible = false,
        okText = "common.ok",
        okAction = () => {},
    } = props;
    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={styles.centeredView}>
                <View style={styles.contentStyle}>
                    <View style={{ padding: DEFAULT_MARGIN }}>
                        <Text style={styles.title}>{i18n.exists(title) && t(title)}</Text>
                        <Text style={styles.message}>{i18n.exists(message) && t(message)}</Text>
                        <PrimaryBtn onPress={okAction} label={i18n.exists(okText) && t(okText)} style={styles.okBtn} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// with two buttons
export const SelectDialog = (props) => {
    const {
        title = "Alert",
        message = "Msg",
        visible = false,
        okText = "OK",
        okAction = () => {},
        cancelText = "Cancel",
        cancelAction = () => {},
    } = props;

    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={styles.centeredView}>
                <View style={styles.contentStyle}>
                    <View style={{ padding: DEFAULT_MARGIN }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                        <PrimaryBtn onPress={okAction} label={okText} style={styles.okBtn} />
                        <OutlinedBtn onPress={cancelAction} label={cancelText} style={styles.cancelBtn} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const Dialog = (props) => {
    const { visible = false, children = <></>, closeModal } = props;
    const inset = useSafeAreaInsets();

    return (
        <Modal visible={visible} animationType="none" transparent>
            <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                    closeModal && closeModal();
                }}
            >
                <View style={styles.centeredView}>
                    <View
                        style={[
                            styles.contentStyle,
                            { maxHeight: SCREEN_HEIGHT - DEFAULT_MARGIN * 4 - inset?.top * 2 },
                        ]}
                    >
                        {children}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

export const Indicator = (props) => {
    const { visible } = props;
    return (
        <Modal visible={visible} animationType="none" transparent>
            <View style={[styles.centeredView, { backgroundColor: AppTheme.colors.backdrop_light }]}>
                <ActivityIndicator size="small" color={AppTheme.colors.primary} />
            </View>
        </Modal>
    );
};
