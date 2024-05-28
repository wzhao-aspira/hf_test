import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
const styles = StyleSheet.create({
    circle: {
        width: 22,
        height: 22,
        borderRadius: 22 / 2,
        backgroundColor: AppTheme.colors.exclaimer_red,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        color: AppTheme.colors.font_color_4,
    },
});
interface ExclaimerWithNumberProps {
    number: number;
    circleStyle?: ViewStyle;
    textStyle?: TextStyle;
}
export function ExclaimerWithNumber(props: ExclaimerWithNumberProps) {
    return (
        <View style={[styles.circle, props.circleStyle]}>
            <Text style={[styles.textStyle, props.textStyle]}>{props.number}</Text>
        </View>
    );
}
