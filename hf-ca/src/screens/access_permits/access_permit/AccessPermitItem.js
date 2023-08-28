import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";

export const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: DEFAULT_MARGIN,
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
    subTitle: {
        marginTop: 5,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
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

function AccessPermitItem(props) {
    const { itemData, itemKey, onPress } = props;
    const { huntCode, huntName, huntDay } = itemData;
    const { t } = useTranslation();
    return (
        <View style={styles.mainContainer}>
            <Pressable key={itemKey} onPress={onPress} testID={genTestId(`accessPermitListItem_${itemKey}`)}>
                <View style={styles.itemContent}>
                    <View style={styles.leftIcon}>
                        <Text style={styles.huntDay} testID={genTestId("huntDay")}>
                            {huntDay?.substr(4, 2)}
                        </Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text testID={genTestId(huntDay)} numberOfLines={0} style={styles.title}>
                            {huntDay}
                        </Text>
                        <Text style={styles.subTitle} testID={genTestId(huntCode)}>
                            {t("accessPermits.huntCode")}: {huntCode}
                        </Text>
                        <Text style={styles.subTitle} testID={genTestId(huntName)}>
                            {t("accessPermits.huntName")}: {huntName}
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

export default AccessPermitItem;
