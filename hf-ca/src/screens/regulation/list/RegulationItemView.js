import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import AppTheme from "../../../assets/_default/AppTheme";
import { genTestId } from "../../../helper/AppHelper";

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
});

function RegulationItemView(props) {
    const { itemData, onPress } = props;
    const { regulationTitle, regulationId, displayOrder } = itemData;
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
                testID={genTestId(`regulation_${regulationId}`)}
            >
                <View style={styles.itemContent}>
                    <View style={styles.leftIcon}>
                        <Text style={styles.huntDay} testID={genTestId(`regulationIndex_${displayOrder}`)}>
                            {displayOrder}
                        </Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text
                            testID={genTestId(`regulationTitle_${regulationTitle}`)}
                            numberOfLines={1}
                            style={styles.title}
                        >
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
