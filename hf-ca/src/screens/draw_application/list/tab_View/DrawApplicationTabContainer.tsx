import { StyleSheet, Text, View } from "react-native";
import { genTestId } from "../../../../helper/AppHelper";

import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { DEFAULT_MARGIN } from "../../../../constants/Dimension";
import DrawApplicationListEmpty from "../DrawApplicationListEmpty";
import DrawSelectors from "../../../../redux/DrawApplicationSelector";
import profileSelectors from "../../../../redux/ProfileSelector";
import { getDrawList } from "../../../../redux/DrawApplicationSlice";
import DrawApplicationListLoading from "../DrawApplicationListLoading";
import DrawListAttention from "./DrawListAttention";
import ListItem from "./DrawApplicationListItem";
import { DrawApplicationListTabName, DrawTabData } from "../../../../types/drawApplication";
import { useAppDispatch } from "../../../../hooks/redux";
import RefreshBar from "../../../../components/RefreshBar";
import DrawApplicationListScrollView from "../DrawApplicationListScrollView";
import { Trans } from "react-i18next";
import AppTheme from "../../../../assets/_default/AppTheme";

interface TabContentProps {
    tabName?: DrawApplicationListTabName;
    tabData?: DrawTabData;
    historicalData?: DrawTabData;
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
    title_label: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
        marginTop: 10,
    },
});
function isTabDataEmpty(data: DrawTabData) {
    return isEmpty(data?.copyHuntsList) && isEmpty(data?.generatedHuntsList);
}
function TabListContent({ tabName, tabData }: TabContentProps) {
    const { copyHuntsList, generatedHuntsList } = tabData;
    return (
        <View style={styles.groupContainer}>
            {!isEmpty(copyHuntsList) && (
                <View>
                    {copyHuntsList.map((copyHuntItem) =>
                        copyHuntItem.isMultiChoice ? (
                            copyHuntItem.items?.map((multiChoiceItem) => (
                                <ListItem
                                    itemData={multiChoiceItem}
                                    key={multiChoiceItem.id}
                                    tabName={tabName}
                                    groupName="multiChoiceCopy"
                                    drawDetailData={[multiChoiceItem]}
                                />
                            ))
                        ) : (
                            <ListItem
                                copyData={copyHuntItem}
                                key={copyHuntItem.year + copyHuntItem.drawType + copyHuntItem.partyNumber}
                                tabName={tabName}
                                groupName="copyHunt"
                                drawDetailData={copyHuntItem.items}
                            />
                        )
                    )}
                </View>
            )}

            {!isEmpty(generatedHuntsList) && (
                <View>
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
        </View>
    );
}

function DrawApplicationTabItem({ tabData = {}, historicalData = {}, tabName, isEmptyTab }: TabProps) {
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
        <DrawApplicationListScrollView>
            <View style={styles.tabContainer}>
                <RefreshBar
                    refreshTime={lastUpdateDate}
                    style={{ paddingVertical: 10 }}
                    onRefresh={() => getDrawListByProfileId()}
                />
                {instructions && <DrawListAttention html={instructions} />}
                <TabListContent tabName={tabName} tabData={tabData} />
                {!isTabDataEmpty(historicalData) && (
                    <View>
                        <Text testID={genTestId("HistoryDrawsLabel")} style={styles.title_label}>
                            {tabName == "successful" && (
                                <Trans i18nKey="drawApplicationList.historicalSuccessfulHunts" />
                            )}
                            {tabName == "unsuccessful" && (
                                <Trans i18nKey="drawApplicationList.historicalUnsuccessfulHunts" />
                            )}
                        </Text>
                        <TabListContent tabName={tabName} tabData={historicalData} />
                    </View>
                )}
            </View>
        </DrawApplicationListScrollView>
    );
}

export default DrawApplicationTabItem;
