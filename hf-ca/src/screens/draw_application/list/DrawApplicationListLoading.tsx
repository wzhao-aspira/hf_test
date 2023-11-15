import { View, StyleSheet } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../../../constants/Dimension";
import SkeletonLoader from "../../../components/SkeletonLoader";
import DrawApplicationListScrollView from "./DrawApplicationListScrollView";

const styles = StyleSheet.create({
    mainContainerStyle: {
        ...AppTheme.shadow,
        borderRadius: 8,
        marginHorizontal: DEFAULT_MARGIN,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingHorizontal: 10,
        marginTop: 28,
    },
});

const width = SCREEN_WIDTH - DEFAULT_MARGIN * 2 - 28;

function DrawApplicationListLoading() {
    const layout = [
        {
            marginVertical: 18,
            width,
            height: 16,
            borderRadius: 4,
        },
        {
            marginTop: 10,
            width,
            height: 16,
            borderRadius: 10,
        },
        {
            marginTop: 18,
            width,
            height: 16,
            borderRadius: 10,
            marginBottom: 18,
        },
    ];
    return (
        <DrawApplicationListScrollView>
            <View style={styles.mainContainerStyle}>
                <SkeletonLoader layout={layout} />
            </View>
        </DrawApplicationListScrollView>
    );
}

export default DrawApplicationListLoading;
