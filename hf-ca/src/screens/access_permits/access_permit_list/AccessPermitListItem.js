import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";

export const styles = StyleSheet.create({
    mainContainerStyle: {
        ...AppTheme.shadow,
        marginVertical: 7,
        borderRadius: 10,
        backgroundColor: AppTheme.colors.font_color_4,
        marginHorizontal: DEFAULT_MARGIN,
    },
    productNameArrowContainer: {
        marginRight: 0,
        marginLeft: 5,
        alignSelf: "center",
    },
    productName: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    touchableStyle: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: AppTheme.colors.font_color_4,
    },
    itemContent: {
        flexDirection: "row",
    },

    itemText: {
        flex: 1,
        alignSelf: "center",
    },
});

function AccessPermitListItem(props) {
    const { itemData, itemKey, onPress } = props;
    const { name } = itemData;
    return (
        <View style={styles.mainContainerStyle}>
            <Pressable
                style={styles.touchableStyle}
                key={itemKey}
                onPress={onPress}
                testID={genTestId("accessPermitListItem", itemKey)}
            >
                <View style={styles.itemContent}>
                    <View style={styles.itemText}>
                        <Text
                            testID={genTestId("accessPermitListItemName", itemKey)}
                            numberOfLines={0}
                            style={styles.productName}
                        >
                            {name}
                        </Text>
                    </View>
                    <View style={styles.productNameArrowContainer}>
                        <FontAwesomeIcon icon={faAngleRight} size={25} color={AppTheme.colors.primary_2} />
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

export default AccessPermitListItem;
