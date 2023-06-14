import * as React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import SplitLine from "../../../components/SplitLine";
import HuntFishList from "./HuntFishList";
import HuntFishOtherInfo from "./HuntFishOtherInfo";

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_4,
        marginTop: 23,
        marginHorizontal: DEFAULT_MARGIN,
    },
    line: {
        marginLeft: DEFAULT_MARGIN,
    },
    description: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_4,
        marginTop: 5,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 23,
    },
});

function HuntFishContent(props) {
    const { category, title, description, primaryColor, purchaseDescription, myLicenseTitle } = props;

    return (
        <ScrollView>
            <View style={styles.content}>
                <View style={{ backgroundColor: primaryColor }}>
                    <Text style={styles.title}>{title}</Text>
                    <SplitLine style={styles.line} />
                    <Text style={styles.description}>{description}</Text>
                </View>

                <HuntFishList primaryColor={primaryColor} purchaseDescription={purchaseDescription} />
                <HuntFishOtherInfo category={category} myLicenseTitle={myLicenseTitle} />

                <View style={{ height: PAGE_MARGIN_BOTTOM, width: "100%" }} />
            </View>
        </ScrollView>
    );
}

export default HuntFishContent;
