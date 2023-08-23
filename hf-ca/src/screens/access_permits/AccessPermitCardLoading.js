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

function AccessPermitCardLoading() {
    const layout = [
        {
            marginTop: 18,
            width: width * 0.8,
            height: 28,
            borderRadius: 10,
            marginBottom: 18,
        },
    ];
    return (
        <View style={styles.mainContainerStyle}>
            <SkeletonLoader layout={layout} />
        </View>
    );
}

export default AccessPermitCardLoading;
