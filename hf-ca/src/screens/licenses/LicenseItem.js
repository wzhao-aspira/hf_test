import * as React from "react";
import { isEmpty } from "lodash";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";

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
    validDateLabel: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        marginTop: 5,
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

function getProductName(itemData) {
    const { legalName, productName = "" } = itemData;
    const name = legalName === "-" || isEmpty(legalName) ? productName : legalName;
    return (
        <Text testID={genTestId(name)} numberOfLines={0} style={styles.productName}>
            {name}
        </Text>
    );
}

function getValidDates(itemData) {
    const validFrom = itemData?.validFrom;
    const validTo = itemData?.validTo;
    if (validFrom && validTo) {
        return (
            <Text testID={genTestId(`${validFrom}-${validTo}`)} style={styles.validDateLabel}>
                Valid From: {validFrom} to {validTo}
            </Text>
        );
    }
    if (validFrom) {
        return (
            <Text testID={genTestId(`${validFrom}`)} style={styles.validDateLabel}>
                Valid From: {validFrom}
            </Text>
        );
    }
    if (validTo) {
        return (
            <Text testID={genTestId(`${validTo}`)} style={styles.validDateLabel}>
                Valid To: {validTo}
            </Text>
        );
    }
    return null;
}

function LicenseItem(props) {
    const { itemData, itemKey, onPress } = props;
    return (
        <View style={styles.mainContainerStyle}>
            <Pressable style={styles.touchableStyle} key={itemKey} onPress={onPress} testID={genTestId("licenseItem")}>
                <View style={styles.itemContent}>
                    <View style={styles.itemText}>
                        {getProductName(itemData)}
                        {getValidDates(itemData)}
                    </View>
                    <View style={styles.productNameArrowContainer}>
                        <FontAwesomeIcon icon={faAngleRight} size={25} color={AppTheme.colors.primary_2} />
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

export default LicenseItem;
