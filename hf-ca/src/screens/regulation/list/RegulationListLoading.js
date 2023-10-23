import { View, StyleSheet } from "react-native";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";

const styles = StyleSheet.create({
    mainContainerStyle: {
        marginHorizontal: DEFAULT_MARGIN,
        marginVertical: DEFAULT_MARGIN,
    },
});

const width = "100%";
function RegulationListLoading() {
    const layout = [
        {
            width,
            height: 18,
            borderRadius: 10,
        },
        {
            width,
            height: 18,
            marginTop: 12,
            borderRadius: 10,
        },
        {
            width,
            height: 18,
            marginTop: 12,
            borderRadius: 10,
        },
    ];
    return (
        <View style={styles.mainContainerStyle}>
            <SkeletonLoader layout={layout} />
        </View>
    );
}

export default RegulationListLoading;
