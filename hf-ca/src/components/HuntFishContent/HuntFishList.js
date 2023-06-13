import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { faClipboardList, faShoppingCart } from "@fortawesome/pro-light-svg-icons";
import AppContract from "../../assets/_default/AppContract";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import HuntFishCardItem from "./HuntFishCardItem";

export const styles = StyleSheet.create({
    section: {
        marginBottom: -20,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
    },
});

function HuntFishList(props) {
    const { primaryColor, purchaseDescription } = props;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{AppContract.strings.hunt_fish_donging_title}</Text>

            <HuntFishCardItem
                title={AppContract.strings.hunt_fish_harvest_report_title}
                description={AppContract.strings.hunt_fish_harvest_report_description}
                icon={faClipboardList}
                primaryColor={primaryColor}
                onPress={() => {
                    console.log("harvest report");
                }}
            />

            <HuntFishCardItem
                title={AppContract.strings.hunt_fish_purchase_title}
                description={purchaseDescription}
                icon={faShoppingCart}
                primaryColor={primaryColor}
                onPress={() => {
                    console.log("purchase license");
                }}
            />
        </View>
    );
}

export default HuntFishList;
