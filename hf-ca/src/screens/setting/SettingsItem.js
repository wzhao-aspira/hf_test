import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons/faAngleRight";
import AppTheme from "../../assets/_default/AppTheme";

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppTheme.colors.font_color_4,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        marginHorizontal: 16,
    },
    title: {
        flex: 1,
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    rightIcon: {
        margin: 10,
        color: AppTheme.colors.primary_2,
    },
    bottomLine: {
        margin: StyleSheet.hairlineWidth,
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: AppTheme.colors.divider,
    },
});

export default function Item({ item, hiddenBottomLine, onPress }) {
    return (
        <View style={[styles.container]}>
            <Pressable
                onPress={() => {
                    onPress(item);
                }}
            >
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}</Text>
                    <FontAwesomeIcon style={styles.rightIcon} icon={faAngleRight} size={18} />
                </View>
            </Pressable>
            {!hiddenBottomLine && <View style={styles.bottomLine} />}
        </View>
    );
}
