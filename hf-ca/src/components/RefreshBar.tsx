import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons/faArrowsRotate";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import { isEmpty } from "lodash";
import AppTheme from "../assets/_default/AppTheme";
import { genTestId } from "../helper/AppHelper";
import { LoadingShimmer } from "./SkeletonLoader";

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

const loadingSkeletonStyles = StyleSheet.create({
    refreshedOn: {
        width: 200,
        borderRadius: 5,
        height: 10,
    },
});

interface RefreshBarProps {
    style: StyleProp<ViewStyle>;
    onRefresh: () => void;
    refreshTime?: string;
    isLoading?: boolean;
}

export default function RefreshBar(props: RefreshBarProps) {
    const { style = {}, onRefresh = () => {}, refreshTime = undefined } = props;
    const { t } = useTranslation();

    return (
        <View style={[styles.container, style]}>
            {!isEmpty(refreshTime) && (
                <LoadingShimmer shimmerStyle={loadingSkeletonStyles.refreshedOn} isLoading={props.isLoading}>
                    <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                        {t("common.refreshedOn")} {refreshTime}
                    </Text>
                </LoadingShimmer>
            )}
            {!props.isLoading && (
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
            )}
        </View>
    );
}
