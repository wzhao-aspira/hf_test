import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import AppTheme from "../../../assets/_default/AppTheme";
import { genTestId } from "../../../helper/AppHelper";
import { RegulationUpdateStatus } from "../../../constants/RegulationUpdateStatus";

export const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
    },
    rightIcon: {
        marginRight: 0,
        marginLeft: 5,
        alignSelf: "center",
    },
    title: {
        ...AppTheme.typography.card_title,
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
    leftIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: AppTheme.colors.primary_2,
    },
    huntDay: {
        color: AppTheme.colors.font_color_4,
    },
    bottomLine: {
        marginTop: 15,
        marginBottom: 20,
        height: 1,
        backgroundColor: AppTheme.colors.divider,
    },
    newBadge: {
        backgroundColor: AppTheme.colors.exclaimer_red,
        borderRadius: 15,
        paddingHorizontal: 2,
        paddingVertical: 4,
        position: "absolute",
        right: -3,
        top: -3,
    },
    newText: {
        color: AppTheme.colors.font_color_4,
        fontSize: 8,
    },
});

function RegulationItemView(props) {
    const { itemData, onPress, itemIndex, updateStatus } = props;
    const { regulationTitle, regulationId } = itemData;
    return (
        <View style={styles.mainContainer}>
            <Pressable
                key={regulationId}
                onPress={() => {
                    console.log(`click regulation:${regulationId}`);
                    if (onPress) {
                        onPress();
                    }
                }}
                testID={genTestId("regulation", itemIndex)}
            >
                <View style={styles.itemContent}>
                    <View style={styles.leftIcon}>
                        <Text style={styles.huntDay} testID={genTestId("regulationIndex", itemIndex)}>
                            {itemIndex}
                        </Text>
                        {(updateStatus === RegulationUpdateStatus.AutoUpdateCompleted ||
                            updateStatus === RegulationUpdateStatus.UpdateNotified) && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newText}>New</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.itemText}>
                        <Text testID={genTestId("regulationTitle", itemIndex)} numberOfLines={1} style={styles.title}>
                            {regulationTitle}
                        </Text>
                    </View>
                    <View style={styles.rightIcon}>
                        <FontAwesomeIcon icon={faAngleRight} size={25} color={AppTheme.colors.primary_2} />
                    </View>
                </View>
                <View style={styles.bottomLine} />
            </Pressable>
        </View>
    );
}

export default RegulationItemView;
