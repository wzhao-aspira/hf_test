import { StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";
import DrawSelectors from "../../../redux/DrawApplicationSelector";
import profileSelectors from "../../../redux/ProfileSelector";
import { getDrawList } from "../../../redux/DrawApplicationSlice";
import { useAppDispatch } from "../../../hooks/redux";
import RefreshBar from "../../../components/RefreshBar";
import DrawApplicationListScrollView from "./DrawApplicationListScrollView";

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
    const dispatch = useAppDispatch();

    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const lastUpdateDate = useSelector(DrawSelectors.selectLastUpdateDate);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            dispatch(
                getDrawList({
                    profileId: activeProfileId,
                })
            );
        }
    };
    return (
        <DrawApplicationListScrollView>
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
        </DrawApplicationListScrollView>
    );
}

export default DrawApplicationListEmpty;
