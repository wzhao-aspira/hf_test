import { StyleSheet, Modal, View, Text, ActivityIndicator, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/Dimension";
import PrimaryBtn from "./PrimaryBtn";
import OutlinedBtn from "./OutlinedBtn";
import { genTestId } from "../helper/AppHelper";

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
    horizontalCtaContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
    },
});

export function SimpleDialogView({
    testID = "",
    title = "common.alert",
    message = "common.message",
    okText = "common.ok",
    okAction = () => {},
    messageStyle = {},
}) {
    const { t, i18n } = useTranslation();
    return (
        <View style={styles.centeredView}>
            <View style={styles.contentStyle}>
                <View style={{ padding: DEFAULT_MARGIN }}>
                    <Text testID={genTestId(`${testID}SimpleDialogTitle`)} style={styles.title}>
                        {i18n.exists(title) ? t(title) : title}
                    </Text>
                    {message && (
                        <Text
                            testID={genTestId(`${testID}SimpleDialogMessage`)}
                            style={{ ...styles.message, ...messageStyle }}
                        >
                            {i18n.exists(message) ? t(message) : message}
                        </Text>
                    )}
                    <PrimaryBtn
                        testID={`${testID}SimpleDialogOKButton`}
                        onPress={okAction}
                        label={i18n.exists(okText) ? t(okText) : okText}
                        style={styles.okBtn}
                    />
                </View>
            </View>
        </View>
    );
}

// with one button
export function SimpleDialog(props) {
    const {
        testID = "",
        title = "common.alert",
        message = "common.message",
        visible = false,
        okText = "common.ok",
        okAction = () => {},
    } = props;
    return (
        <View>
            <Modal visible={visible} animationType="none" transparent>
                <SimpleDialogView
                    testID={testID}
                    title={title}
                    message={message}
                    okText={okText}
                    okAction={okAction}
                    {...props}
                />
            </Modal>
        </View> 
    );
}

export function SelectDialogView({
    testID = "",
    title = "common.alert",
    message = "common.message",
    okText = "common.ok",
    okAction = () => {},
    cancelText = "common.cancel",
    cancelAction = () => {},
    children = null,
    horizontalCTA = false,
    messageStyle = {},
}) {
    const { t, i18n } = useTranslation();
    return (
        <View style={styles.centeredView}>
            <View style={styles.contentStyle}>
                <View style={{ padding: DEFAULT_MARGIN }}>
                    <Text testID={genTestId(`${testID}SelectDialogTitle`)} style={styles.title}>
                        {i18n.exists(title) ? t(title) : title}
                    </Text>
                    <Text
                        testID={genTestId(`${testID}SelectDialogTitle`)}
                        style={{ ...styles.message, ...messageStyle }}
                    >
                        {i18n.exists(message) ? t(message) : message}
                    </Text>
                    {children}
                    {!horizontalCTA && (
                        <>
                            <PrimaryBtn
                                onPress={okAction}
                                label={i18n.exists(okText) ? t(okText) : okText}
                                style={styles.okBtn}
                                testID={`${testID}SelectDialogOKButton`}
                            />
                            <OutlinedBtn
                                onPress={cancelAction}
                                label={i18n.exists(cancelText) ? t(cancelText) : cancelText}
                                style={styles.cancelBtn}
                                testID={`${testID}SelectDialogCancelButton`}
                            />
                        </>
                    )}

                    {horizontalCTA && (
                        <View style={styles.horizontalCtaContainer}>
                            <OutlinedBtn
                                onPress={cancelAction}
                                label={t("common.cancel")}
                                testID={`${testID}SelectDialogCancelButton`}
                            />
                            <PrimaryBtn
                                onPress={okAction}
                                label={i18n.exists(okText) ? t(okText) : okText}
                                testID={`${testID}SelectDialogOKButton`}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

// with two buttons
export function SelectDialog(props) {
    const {
        testID = "",
        title = "common.alert",
        message = "common.message",
        visible = false,
        okText = "common.ok",
        okAction = () => {},
        cancelText = "common.cancel",
        cancelAction = () => {},
        children = null,
        horizontalCTA = false,
    } = props;

    return (
        <View>
            <Modal visible={visible} animationType="none" transparent>
                <SelectDialogView
                    testID={testID}
                    title={title}
                    message={message}
                    okText={okText}
                    okAction={okAction}
                    cancelText={cancelText}
                    cancelAction={cancelAction}
                    horizontalCTA={horizontalCTA}
                >
                    {children}
                </SelectDialogView>
            </Modal>
        </View> 
    );
}

export function DialogWrapper(props) {
    const { testID = "", children = null, closeModal } = props;
    const inset = useSafeAreaInsets();

    return (
        <Pressable
            accessible={false}
            testID={genTestId(`${testID}DialogCloseButton`)}
            style={{ flex: 1 }}
            onPress={() => {
                if (closeModal) {
                    closeModal();
                }
            }}
        >
            <View style={styles.centeredView}>
                <View style={[styles.contentStyle, { maxHeight: SCREEN_HEIGHT - DEFAULT_MARGIN * 4 - inset.top * 2 }]}>
                    {children}
                </View>
            </View>
        </Pressable>
    );
}

export function Dialog(props) {
    const { testID = "", visible = false, children = null, closeModal } = props;
    return (
        <View>
            <Modal visible={visible} animationType="none" transparent>
                <DialogWrapper testID={testID} closeModal={closeModal}>
                    {children}
                </DialogWrapper>
            </Modal>
        </View>
    );
}

export function Indicator(props) {
    const { visible } = props;
    return (
        <View>
            <Modal visible={visible} animationType="none" transparent>
                <View style={[styles.centeredView, { backgroundColor: AppTheme.colors.backdrop_light }]}>
                    <ActivityIndicator size="small" color={AppTheme.colors.primary} />
                </View>
            </Modal>
        </View> 
    );
}
