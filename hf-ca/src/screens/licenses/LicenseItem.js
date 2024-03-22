import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import { Trans } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";
import { appConfig } from "../../services/AppConfigService";

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
    licenseTag: {
        ...AppTheme.typography.temperature_switch,
        color: AppTheme.colors.error,
        marginTop: 5,
    },
    huntTagDesc: {
        width: "100%",
        flexDirection: "column",
        marginTop: 5,
    },
    huntTagDescNameValue: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
    },
});

function getProductName(itemData) {
    const { name } = itemData;
    return (
        <Text testID={genTestId(name)} numberOfLines={0} style={styles.productName}>
            {name}
        </Text>
    );
}

function getTagDescription(itemData) {
    const { name, huntTagDescription } = itemData;
    return (
        !!huntTagDescription && (
            <View style={styles.huntTagDesc}>
                <Text testID={genTestId(`${name}_tag_desc_name`)} numberOfLines={0} style={styles.huntTagDescNameValue}>
                    <Trans i18nKey="license.tagDescription" />
                </Text>
                <Text
                    testID={genTestId(`${name}_tag_desc_value`)}
                    numberOfLines={0}
                    style={styles.huntTagDescNameValue}
                >
                    {huntTagDescription}
                </Text>
            </View>
        )
    );
}

function getValidDates(itemData) {
    const altTextValidFromTo = itemData?.altTextValidFromTo;
    if (altTextValidFromTo) {
        return (
            <Text testID={genTestId(`${altTextValidFromTo}`)} style={styles.validDateLabel}>
                {altTextValidFromTo}
            </Text>
        );
    }
    return null;
}

function getLicenseReportConfirmationText(itemData) {
    const licenseReportConfirmationText = itemData?.licenseReportConfirmationText;
    if (licenseReportConfirmationText) {
        return (
            <Text testID={genTestId("reportStatus")} style={styles.validDateLabel}>
                {licenseReportConfirmationText}
            </Text>
        );
    }
    return null;
}

function getLicenseTag(itemData) {
    const { mobileAppNeedPhysicalDocument } = itemData;
    if (mobileAppNeedPhysicalDocument) {
        return (
            <Text testID={genTestId("licenseTag")} style={styles.licenseTag}>
                {appConfig.data.documentRequiredIndicator}
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
                        {getTagDescription(itemData)}
                        {getValidDates(itemData)}
                        {getLicenseReportConfirmationText(itemData)}
                        {getLicenseTag(itemData)}
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
