import { StyleSheet, View } from "react-native";

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
});

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

function DrawApplicationTabItem({ tabData = {}, tabName, isEmptyTab }: TabProps) {
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
            </View>
        </DrawApplicationListScrollView>
    );
}

export default DrawApplicationTabItem;
