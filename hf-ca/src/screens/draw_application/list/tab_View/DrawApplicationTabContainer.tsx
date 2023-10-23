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
import {
    DrawApplicationListTabName,
    NonPendingStatusList,
    DrawResultsListItem,
} from "../../../../types/drawApplication";
import { useAppDispatch } from "../../../../hooks/redux";

interface TabContentProps {
    tabName?: DrawApplicationListTabName;
    pendingList?: DrawResultsListItem[];
    tabData?: NonPendingStatusList;
}
interface TabProps extends TabContentProps {
    isEmptyTab?: boolean;
}

export const styles = StyleSheet.create({
    tabContainer: {
        marginHorizontal: DEFAULT_MARGIN,
    },
    groupContainer: {
        marginTop: 16,
    },
    groupTitle: {
        ...AppTheme.typography.overlay_hyperLink,
        fontSize: 15,
        marginBottom: 10,
    },
});

function TabListContent({ tabName, pendingList, tabData }: TabContentProps) {
    const { t } = useTranslation();

    const copyHuntGroupTitle =
        tabName === "successful"
            ? t("drawApplicationList.successfulCopyTitle")
            : t("drawApplicationList.unsuccessfulCopyTitle");

    const generatedHuntGroupTitle =
        tabName === "successful"
            ? t("drawApplicationList.successfulGeneratedTitle")
            : t("drawApplicationList.unsuccessfulGeneratedTitle");

    const multiChoiceGroupTitle =
        tabName === "successful"
            ? t("drawApplicationList.successfulMultiTitle")
            : t("drawApplicationList.unsuccessfulMultiTitle");

    if (tabName === "pending") {
        return (
            <View style={styles.groupContainer}>
                {pendingList?.map((item) => (
                    <ListItem itemData={item} key={item.id} tabName={tabName} drawDetailData={[item]} />
                ))}
            </View>
        );
    }
    const { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList } = tabData;

    return (
        <View>
            {!isEmpty(copyHuntsList) && (
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle} testID={genTestId("copyHuntGroupTitle")}>
                        {copyHuntGroupTitle}
                    </Text>
                    {copyHuntsList.map((item) => (
                        <ListItem
                            copyData={item}
                            key={item.year + item.drawType}
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
                        {generatedHuntGroupTitle}
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
                        {multiChoiceGroupTitle}
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

function DrawApplicationTabItem({ tabData = {}, pendingList = [], tabName, isEmptyTab }: TabProps) {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const refreshing = useSelector(DrawSelectors.selectIsDrawListLoading);
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);
    const instructions = useSelector(DrawSelectors.selectInstructions);

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
                {instructions && <DrawListAttention html={instructions} />}
                <TabListContent tabName={tabName} pendingList={pendingList} tabData={tabData} />
            </View>
        </ScrollView>
    );
}

export default DrawApplicationTabItem;
