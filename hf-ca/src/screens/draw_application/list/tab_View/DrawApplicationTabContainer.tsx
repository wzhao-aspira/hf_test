import { StyleSheet, ScrollView, RefreshControl, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../../constants/Dimension";
import { genTestId } from "../../../../helper/AppHelper";
import DrawApplicationListEmpty from "../DrawApplicationListEmpty";
import AppTheme from "../../../../assets/_default/AppTheme";
import DrawSelectors from "../../../../redux/DrawApplicationSelector";
import profileSelectors from "../../../../redux/ProfileSelector";
import { getDrawList } from "../../../../redux/DrawApplicationSlice";
import DrawApplicationListLoading from "../DrawApplicationListLoading";
import DrawListAttention from "./DrawListAttention";
import ListItem from "./DrawApplicationListItem";
import { DrawApplicationListTabName, DrawTabData } from "../../../../types/drawApplication";
import { useAppDispatch } from "../../../../hooks/redux";
import RefreshBar from "../../../../components/RefreshBar";

interface TabContentProps {
    tabName?: DrawApplicationListTabName;
    tabData?: DrawTabData;
}
interface TabProps extends TabContentProps {
    isEmptyTab?: boolean;
}

export const styles = StyleSheet.create({
    tabContainer: {
        marginHorizontal: DEFAULT_MARGIN,
    },
    groupContainer: {
        marginTop: 20,
    },
    groupTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginBottom: 15,
    },
});

const groupTitles = {
    successful: {
        copyHuntGroupTitle: "drawApplicationList.successfulCopyTitle",
        generatedHuntGroupTitle: "drawApplicationList.successfulGeneratedTitle",
        multiChoiceGroupTitle: "drawApplicationList.successfulMultiTitle",
    },
    unsuccessful: {
        copyHuntGroupTitle: "drawApplicationList.unsuccessfulCopyTitle",
        generatedHuntGroupTitle: "drawApplicationList.unsuccessfulGeneratedTitle",
        multiChoiceGroupTitle: "drawApplicationList.unsuccessfulMultiTitle",
    },
    pending: {
        copyHuntGroupTitle: "drawApplicationList.pendingCopyTitle",
        generatedHuntGroupTitle: "drawApplicationList.pendingGeneratedTitle",
        multiChoiceGroupTitle: "drawApplicationList.pendingMultiTitle",
    },
};

function TabListContent({ tabName, tabData }: TabContentProps) {
    const { t } = useTranslation();
    const { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList } = tabData;
    return (
        <View>
            {!isEmpty(copyHuntsList) && (
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle} testID={genTestId("copyHuntGroupTitle")}>
                        {t(groupTitles[tabName].copyHuntGroupTitle)}
                    </Text>
                    {copyHuntsList.map((item) => (
                        <ListItem
                            copyData={item}
                            key={item.year + item.drawType + item.partyNumber}
                            tabName={tabName}
                            groupName="copyHunt"
                            drawDetailData={item.items}
                        />
                    ))}
                </View>
            )}

            {!isEmpty(generatedHuntsList) && (
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle} testID={genTestId("generatedHuntGroupTitle")}>
                        {t(groupTitles[tabName].generatedHuntGroupTitle)}
                    </Text>
                    {generatedHuntsList.map((item) => (
                        <ListItem
                            itemData={item}
                            key={item.id}
                            tabName={tabName}
                            groupName="generatedHunt"
                            drawDetailData={[item]}
                        />
                    ))}
                </View>
            )}

            {!isEmpty(multiChoiceCopyHuntsList) && (
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle} testID={genTestId("multiChoiceGroupTitle")}>
                        {t(groupTitles[tabName].multiChoiceGroupTitle)}
                    </Text>
                    {multiChoiceCopyHuntsList.map((item) => (
                        <ListItem
                            itemData={item}
                            key={item.id}
                            tabName={tabName}
                            groupName="multiChoiceCopy"
                            drawDetailData={[item]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

function DrawApplicationTabItem({ tabData = {}, tabName, isEmptyTab }: TabProps) {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const refreshing = useSelector(DrawSelectors.selectIsDrawListLoading);
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const instructions = useSelector(DrawSelectors.selectInstructions);
    const lastUpdateDate = useSelector(DrawSelectors.selectLastUpdateDate);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            dispatch(getDrawList(activeProfileId));
        }
    };

    if (refreshing) {
        return <DrawApplicationListLoading />;
    }

    if (isEmptyTab) {
        return <DrawApplicationListEmpty />;
    }

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
            <View style={styles.tabContainer}>
                <RefreshBar
                    refreshTime={lastUpdateDate}
                    style={{ paddingVertical: 10 }}
                    onRefresh={() => getDrawListByProfileId()}
                />
                {instructions && <DrawListAttention html={instructions} />}
                <TabListContent tabName={tabName} tabData={tabData} />
            </View>
        </ScrollView>
    );
}

export default DrawApplicationTabItem;
