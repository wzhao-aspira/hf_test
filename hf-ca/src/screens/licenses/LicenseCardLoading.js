/**
 * @todo: Technical debt: Home Page License carousel loading has a
 * Layout Shift when Loading -> loaded.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../../constants/Dimension";
import SkeletonLoader from "../../components/SkeletonLoader";

const styles = StyleSheet.create({
    mainContainerStyle: {
        ...AppTheme.shadow,
        borderRadius: 10,
        marginHorizontal: DEFAULT_MARGIN,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingHorizontal: 14,
        marginVertical: 7,
    },
});

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 28;

function LicenseCardLoading() {
    const layout = [
        {
            marginTop: 18,
            width: width * 0.82,
            height: 16,
            borderRadius: 10,
        },
        {
            width: width * 0.64,
            height: 12,
            marginTop: 12,
            marginBottom: 18,
            borderRadius: 10,
        },
    ];
    return (
        <View style={styles.mainContainerStyle}>
            <SkeletonLoader layout={layout} />
        </View>
    );
}

export default LicenseCardLoading;
