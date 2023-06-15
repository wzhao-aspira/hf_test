import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import AppContract from "../../../assets/_default/AppContract";
import { CATEGORY } from "../../../constants/Constants";
import HuntFishOtherInfoItem from "./HuntFishOtherInfoItem";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";

const styles = StyleSheet.create({
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginTop: DEFAULT_MARGIN,
        marginHorizontal: DEFAULT_MARGIN,
        marginBottom: 16,
    },

    otherInfo: {
        marginHorizontal: DEFAULT_MARGIN,
        borderRadius: 14,
        backgroundColor: AppTheme.colors.font_color_4,
        marginBottom: 41,
        ...AppTheme.shadow,
    },
});

function HuntFishOtherInfo(props) {
    const { category, myLicenseTitle = AppContract.strings.hf_pg_my_lic } = props;

    return (
        <View>
            <Text style={styles.sectionTitle}>{AppContract.strings.hunt_fish_other_info_title}</Text>
            <View style={styles.otherInfo}>
                <HuntFishOtherInfoItem
                    title={myLicenseTitle}
                    onPress={() => {
                        NavigationService.navigate(Routers.licenseList);
                    }}
                />
                {category == CATEGORY.Hunting && (
                    <HuntFishOtherInfoItem title={AppContract.strings.my_draw_applications} onPress={() => {}} />
                )}
                <HuntFishOtherInfoItem title={AppContract.strings.my_draw_summary} onPress={() => {}} />
                <HuntFishOtherInfoItem title={AppContract.strings.rule_regulations} onPress={() => {}} />
                <HuntFishOtherInfoItem title={AppContract.strings.usefulLink} onPress={() => {}} />
            </View>
        </View>
    );
}

export default HuntFishOtherInfo;
