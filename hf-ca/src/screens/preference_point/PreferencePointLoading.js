import { View, StyleSheet } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import SkeletonLoader from "../../components/SkeletonLoader";

const styles = StyleSheet.create({
    mainContainerStyle: {
        ...AppTheme.shadow,
        borderRadius: 20,
        marginHorizontal: 14,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingHorizontal: 24,
        marginVertical: 26,
        paddingVertical: 20,
    },
});

const width = "100%";
const PreferenceLoading = () => {
    const layout = [
        {
            width,
            height: 16,
            marginBottom: 24,
            borderRadius: 10,
        },
        {
            width,
            height: 12,
            marginVertical: 12,
            borderRadius: 10,
        },
        {
            width,
            height: 12,
            marginTop: 12,
            borderRadius: 10,
        },
    ];
    return (
        <View style={styles.mainContainerStyle}>
            <SkeletonLoader layout={layout} />
        </View>
    );
};

export default PreferenceLoading;
