import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import AppTheme from "../../../../assets/_default/AppTheme";
import { genTestId } from "../../../../helper/AppHelper";
import convertDrawResultsListToDrawApplicationList from "../../detail/utils/convertDrawResultsListToDrawApplicationList";

import NavigationService from "../../../../navigation/NavigationService";
import Routers from "../../../../constants/Routers";

import type {
    DrawApplicationListGroupName,
    DrawApplicationListTabName,
    CopyHuntsItem,
    DrawResultsListItem,
} from "../../../../types/drawApplication";

export const styles = StyleSheet.create({
    mainContainer: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        marginBottom: 15,
        padding: 10,
        paddingLeft: 15,
        borderRadius: 8,
    },
    rightIcon: {
        marginRight: 0,
        marginLeft: 5,
        alignSelf: "center",
    },
    title: {
        ...AppTheme.typography.overlay_hyperLink,
        color: AppTheme.colors.font_color_1,
    },
    subTitle: {
        marginTop: 5,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_1,
    },

    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    itemText: {
        flex: 1,
        alignSelf: "center",
    },
});

interface ListItemResultSectionProps {
    itemData: DrawResultsListItem;
    copyData?: CopyHuntsItem;
    tabName: DrawApplicationListTabName;
    groupName?: DrawApplicationListGroupName;
}

function ListItemResultSection({ tabName, itemData, groupName, copyData }: ListItemResultSectionProps) {
    const { drawnSequence } = itemData || {};
    const { items } = copyData || {};
    const { t } = useTranslation();
    if (tabName === "unsuccessful") {
        return (
            <Text style={{ ...styles.subTitle }} testID={genTestId("unsuccessfulText")}>
                {t("drawApplicationList.unsuccessful")}
            </Text>
        );
    }
    if (groupName === "multiChoiceCopy") {
        return (
            <Text style={{ ...styles.subTitle }} testID={genTestId("successfulText")}>
                {t("drawApplicationList.successful")}
            </Text>
        );
    }
    if (groupName === "generatedHunt") {
        return (
            <Text style={{ ...styles.subTitle }} testID={genTestId(`successfulText_${drawnSequence}`)}>
                {t("drawApplicationList.successful")} {t("accessPermits.Reservation#")}
                {drawnSequence}
            </Text>
        );
    }

    return items?.map(
        (item) =>
            item.drawWon === "Y" && (
                <Text
                    style={{ ...styles.subTitle }}
                    testID={genTestId(`successfulFor_${item.huntName}`)}
                    key={item.huntName}
                >
                    {t("drawApplicationList.successfulFor")} {item.huntCode} {item.huntName && `(${item.huntName})`}
                </Text>
            )
    );
}

interface ItemProps {
    itemData?: DrawResultsListItem;
    copyData?: CopyHuntsItem;
    tabName: DrawApplicationListTabName;
    drawDetailData: DrawResultsListItem[];
    groupName?: DrawApplicationListGroupName;
}

function ListItem({ itemData, tabName, groupName, copyData, drawDetailData }: ItemProps) {
    const { t } = useTranslation();

    const {
        year: normalDataYear,
        drawType: normalDataDrawType,
        formatHuntDay,
        huntName,
        huntId,
        drawStatus: normalDataDrawStatus,
    } = itemData || {};
    const { year: copyDataYear, drawType: copyDataDrawType, drawStatus: copyDataDrawStatus, items } = copyData || {};
    let year = normalDataYear;
    let drawType = normalDataDrawType;
    let drawStatus = normalDataDrawStatus;

    let itemExtTitle = huntName && `(${huntName})`;
    if (groupName === "copyHunt" && !isEmpty(items)) {
        const huntCodes = items?.map((i) => i.huntCode);
        itemExtTitle = huntCodes && `(${huntCodes.join(", ")})`;
        year = copyDataYear;
        drawType = copyDataDrawType;
        drawStatus = copyDataDrawStatus;
    }
    if (groupName === "generatedHunt") {
        if (huntName || formatHuntDay) {
            itemExtTitle = `(${huntName && `${huntName} `}${formatHuntDay && formatHuntDay})`;
        }
    }

    return (
        <View style={styles.mainContainer}>
            <Pressable
                onPress={() => {
                    const drawApplicationList = convertDrawResultsListToDrawApplicationList(drawDetailData);

                    NavigationService.navigate(Routers.drawApplicationDetail, {
                        drawApplicationDetailData: {
                            title: `${year} ${drawType}`,
                            DrawApplicationChoices: drawApplicationList,
                        },
                    });
                }}
                testID={genTestId(`drawApplicationItem_${huntId}`)}
            >
                <View style={styles.itemContent}>
                    <View style={styles.itemText}>
                        <Text testID={genTestId(`title_${huntName}`)} numberOfLines={0} style={styles.title}>
                            {year} {drawType} {itemExtTitle}
                        </Text>

                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text style={styles.subTitle}>{t("drawApplicationList.status")}:</Text>
                            <Text
                                style={{ ...styles.subTitle, marginLeft: 2 }}
                                testID={genTestId(`status_${drawStatus}`)}
                            >
                                {drawStatus}
                            </Text>
                        </View>

                        {tabName !== "pending" && (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.subTitle}>{t("drawApplicationList.result")}:</Text>
                                <View style={{ flex: 1, marginLeft: 2 }}>
                                    <ListItemResultSection
                                        groupName={groupName}
                                        tabName={tabName}
                                        itemData={itemData}
                                        copyData={copyData}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={styles.rightIcon}>
                        <FontAwesomeIcon icon={faAngleRight} size={20} color={AppTheme.colors.primary_2} />
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

export default ListItem;
