import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../constants/Dimension";
import SkeletonLoader from "../../components/SkeletonLoader";

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2;

const styles = StyleSheet.create({
    cardContainer: {
        paddingHorizontal: DEFAULT_MARGIN,
        marginTop: 90,
    },
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: 148,
        width,
        borderRadius: DEFAULT_RADIUS,
        marginBottom: 20,
        paddingHorizontal: 14,
    },
});

const issuerLocationsListLoading = React.memo(() => {
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
        {
            width: width * 0.235,
            height: 12,
            marginTop: 12,
            marginBottom: 28,
            borderRadius: DEFAULT_RADIUS,
        },
        [
            {
                width: width * 0.266,
                height: 21,
                borderRadius: DEFAULT_RADIUS,
            },
            {
                width: width * 0.34,
                height: 21,
                borderRadius: DEFAULT_RADIUS,
                marginRight: width * 0.25,
            },
        ],
    ];

    const renderCard = () => {
        return (
            <View style={styles.card}>
                <SkeletonLoader layout={layout} />
            </View>
        );
    };

    return (
        <ScrollView style={styles.cardContainer}>
            {renderCard()}
            {renderCard()}
            {renderCard()}
        </ScrollView>
    );
});

export default issuerLocationsListLoading;
