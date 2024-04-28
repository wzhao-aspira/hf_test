import React from "react";
import { View, StyleSheet } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import SkeletonLoader from "../../../components/SkeletonLoader";

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2;

const styles = StyleSheet.create({
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: 70,
        width,
        borderRadius: DEFAULT_RADIUS,
        marginBottom: 20,
        paddingHorizontal: 14,
    },
});

const ProfileItemLoading = React.memo(() => {
    const layout = [
        {
            width: width * 0.58,
            height: 16,
            marginTop: 15,
            borderRadius: DEFAULT_RADIUS,
        },
        {
            width: width * 0.37,
            height: 12,
            marginTop: 12,
            borderRadius: DEFAULT_RADIUS,
        },
    ];

    return (
        <View style={styles.card}>
            <SkeletonLoader layout={layout} />
        </View>
    );
});

export default ProfileItemLoading;
