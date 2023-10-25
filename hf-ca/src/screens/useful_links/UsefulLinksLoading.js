import { View, StyleSheet } from "react-native";
import SkeletonLoader from "../../components/SkeletonLoader";

const styles = StyleSheet.create({
    mainContainerStyle: {
        marginBottom: 50,
    },
});

const width = "100%";
const skeletonArray = [1, 2];

function UsefulLinksLoading() {
    const layout = [
        {
            width,
            height: 18,
        },
        {
            width,
            height: 18,
            marginTop: 22,
        },
        {
            width: "25%",
            height: 18,
            marginTop: 22,
        },
    ];
    return skeletonArray.map((item) => (
        <View style={styles.mainContainerStyle} key={item}>
            <SkeletonLoader layout={layout} />
        </View>
    ));
}

export default UsefulLinksLoading;
