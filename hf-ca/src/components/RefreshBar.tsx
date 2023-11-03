import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons/faArrowsRotate";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import { isEmpty } from "lodash";
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
        ...AppTheme.typography.refresh_time,
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

    return (
        <View style={[styles.container, style]}>
            {!isEmpty(refreshTime) && (
                <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                    {t("common.refreshedOn")} {refreshTime}
                </Text>
            )}
            <Pressable
                testID={genTestId("clickToRefresh")}
                onPress={() => {
                    onRefresh?.();
                }}
                style={styles.horizontalContainer}
            >
                <Text style={{ ...styles.label, marginHorizontal: 5 }}>{t("common.clickRefresh")}</Text>
                <FontAwesomeIcon icon={faArrowsRotate} color={AppTheme.colors.refresh_time} size={16} />
            </Pressable>
        </View>
    );
}
