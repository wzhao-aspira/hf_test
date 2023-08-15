import React from "react";
import { View, StyleSheet } from "react-native";
import { DEFAULT_MARGIN, DEFAULT_RADIUS, SCREEN_WIDTH } from "../../../constants/Dimension";
import SkeletonLoader from "../../../components/SkeletonLoader";

const width = SCREEN_WIDTH - DEFAULT_MARGIN;

const styles = StyleSheet.create({
    card: {
        width,
        borderRadius: DEFAULT_RADIUS,
        marginBottom: 20,
        paddingHorizontal: 14,
    },
});

const headerLayout = [
    {
        width: width * 0.88,
        height: 36,
        marginVertical: 46,
        borderRadius: DEFAULT_RADIUS,
    },
];

const itemLayout = [
    {
        width: width * 0.68,
        height: 16,
        marginTop: 15,
        borderRadius: DEFAULT_RADIUS,
    },
    {
        width: width * 0.68,
        height: 16,
        marginTop: 15,
        borderRadius: DEFAULT_RADIUS,
    },
];

const ProfileDetailsLoading = React.memo(({ isHeader }: { isHeader: boolean }) => {
    const layout = isHeader ? headerLayout : itemLayout;
    return (
        <View style={[styles.card, { alignItems: isHeader ? "center" : "flex-start" }]}>
            <SkeletonLoader layout={layout} />
        </View>
    );
});

export default ProfileDetailsLoading;
