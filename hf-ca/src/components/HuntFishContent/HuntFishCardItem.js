import * as React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";

export const styles = StyleSheet.create({
    cardItem: {
        backgroundColor: AppTheme.colors.font_color_4,
        marginHorizontal: DEFAULT_MARGIN,
        borderRadius: 14,
        marginBottom: 20,
        ...AppTheme.shadow,
    },
    cardItemContent: {
        flexDirection: "row",
    },
    cardIcon: {
        backgroundColor: AppTheme.colors.font_color_4,
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 16,
        marginVertical: 16,
        justifyContent: "center",
        alignItems: "center",
        ...AppTheme.shadow,
    },
    cardContent: {
        marginLeft: 20,
        marginRight: 16,
        alignSelf: "center",
    },
    cardTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginBottom: 5,
    },
    cardDescription: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_1,
    },
});

function HuntFishCardItem(props) {
    const { title, description, icon, primaryColor, onPress } = props;
    return (
        <View style={styles.cardItem}>
            <Pressable
                testID={genTestId(title)}
                onPress={() => {
                    onPress();
                }}
            >
                <View style={styles.cardItemContent}>
                    <View style={styles.cardIcon}>
                        <FontAwesomeIcon icon={icon} size={35} color={primaryColor} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle} testID={genTestId(`${title}-title`)}>
                            {title}
                        </Text>
                        <Text style={styles.cardDescription} testID={genTestId(`${title}-description`)}>
                            {description}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

export default HuntFishCardItem;
