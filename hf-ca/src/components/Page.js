import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PAGE_MARGIN_BOTTOM } from "../constants/Dimension";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
});

export default function Page({ style, children }) {
    const safeAreaInsets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingBottom: safeAreaInsets?.bottom + PAGE_MARGIN_BOTTOM }, style]}>
            {children}
        </View>
    );
}
