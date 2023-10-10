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
        paddingHorizontal: 20,
        marginVertical: 26,
    },
});

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 40;

function LicenseDetailLoading() {
    const layoutRowOther = [
        {
            marginTop: 40,
            width: width * 0.8,
            height: 30,
            borderRadius: 20,
        },
        {
            height: 18,
            width: width * 1,
            marginTop: 10,
            borderRadius: 10,
        },
        {
            height: 18,
            width: width * 1,
            marginTop: 10,
            borderRadius: 10,
        },
        {
            height: 18,
            width: width * 0.5,
            marginTop: 10,
            marginBottom: 40,
            borderRadius: 10,
        },
    ];
    return (
        <View style={styles.mainContainerStyle}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 30,
                }}
            >
                <SkeletonLoader
                    layout={[
                        {
                            width: width * 0.2,
                            height: 30,
                            borderRadius: 20,
                        },
                    ]}
                />
                <SkeletonLoader
                    layout={[
                        {
                            width: width * 0.2,
                            height: 30,
                            borderRadius: 20,
                        },
                    ]}
                />
            </View>
            <View>
                <SkeletonLoader layout={layoutRowOther} />
            </View>
        </View>
    );
}

export default LicenseDetailLoading;
