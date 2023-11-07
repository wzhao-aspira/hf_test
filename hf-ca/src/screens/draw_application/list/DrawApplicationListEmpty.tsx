import { StyleSheet, View, Text, ScrollView, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";
import DrawSelectors from "../../../redux/DrawApplicationSelector";
import profileSelectors from "../../../redux/ProfileSelector";
import { getDrawList } from "../../../redux/DrawApplicationSlice";
import { useAppDispatch } from "../../../hooks/redux";
import RefreshBar from "../../../components/RefreshBar";

export const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        marginHorizontal: DEFAULT_MARGIN,
        justifyContent: "center",
    },
    emptyArea: {
        marginTop: -80,
        width: "100%",
    },
    emptyTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
    emptyDescription: {
        marginTop: 8,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        textAlign: "center",
    },
    refreshBar: { paddingVertical: 10, marginHorizontal: DEFAULT_MARGIN },
});

function DrawApplicationListEmpty() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const refreshing = useSelector(DrawSelectors.selectIsDrawListLoading);
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const lastUpdateDate = useSelector(DrawSelectors.selectLastUpdateDate);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            dispatch(getDrawList(activeProfileId));
        }
    };
    return (
        <ScrollView
            testID={genTestId("drawApplicationList")}
            contentContainerStyle={{
                flexGrow: 1,
                marginTop: 14,
                paddingBottom: insets.bottom + PAGE_MARGIN_BOTTOM,
            }}
            refreshControl={
                <RefreshControl
                    colors={[AppTheme.colors.primary]}
                    tintColor={AppTheme.colors.primary}
                    refreshing={refreshing}
                    onRefresh={() => {
                        getDrawListByProfileId();
                    }}
                />
            }
        >
            <RefreshBar
                refreshTime={lastUpdateDate}
                style={styles.refreshBar}
                onRefresh={() => getDrawListByProfileId()}
            />
            <View style={styles.emptyContainer}>
                <View style={styles.emptyArea}>
                    <Text testID={genTestId("noDrawListTitle")} style={styles.emptyTitle}>
                        {t("drawApplicationList.emptyDrawTitle")}
                    </Text>
                    <Text testID={genTestId("noDrawListSubtitle")} style={styles.emptyDescription}>
                        {t("drawApplicationList.emptyDrawSubTitle")}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

export default DrawApplicationListEmpty;
