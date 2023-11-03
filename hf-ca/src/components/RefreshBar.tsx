import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons/faArrowsRotate";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    horizontalContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    label: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.refresh_time,
    },
});

interface RefreshBarProps {
    style: StyleProp<ViewStyle>;
    onRefresh: () => void;
    refreshTime?: string;
}

export default function RefreshBar(props: RefreshBarProps) {
    const { style = {}, onRefresh = () => {}, refreshTime = undefined } = props;
    const { t } = useTranslation();

    if (refreshTime == undefined) {
        return (
            <Pressable
                testID={genTestId("clickOrDragToRefresh")}
                onPress={() => {
                    onRefresh?.();
                }}
                style={[{ flexDirection: "row", alignItems: "center" }, style]}
            >
                <FontAwesomeIcon
                    icon={faArrowsRotate}
                    color={AppTheme.colors.refresh_time}
                    size={16}
                    style={{ marginRight: 5 }}
                />
                <Text style={styles.label}>{t("common.clickDragRefresh")}</Text>
            </Pressable>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>
                {t("common.refreshedOn")} {refreshTime}
            </Text>
            <Pressable
                testID={genTestId("clickToRefresh")}
                onPress={() => {
                    onRefresh?.();
                }}
                style={styles.horizontalContainer}
            >
                <Text style={{ ...styles.label, marginRight: 5 }}>{t("common.clickRefresh")}</Text>
                <FontAwesomeIcon icon={faArrowsRotate} color={AppTheme.colors.refresh_time} size={16} />
            </Pressable>
        </View>
    );
}
