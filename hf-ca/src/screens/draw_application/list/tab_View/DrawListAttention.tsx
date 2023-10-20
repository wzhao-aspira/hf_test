import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Trans } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { genTestId } from "../../../../helper/AppHelper";
import AppTheme from "../../../../assets/_default/AppTheme";

const styles = StyleSheet.create({
    attention_label: {
        ...AppTheme.typography.temperature_switch,
        marginBottom: 14,
    },
});
function DrawListAttention({ html }) {
    const { width } = useWindowDimensions();

    return (
        <View>
            <Text testID={genTestId("AttentionLabel")} style={styles.attention_label}>
                <Trans i18nKey="common.attention" />
            </Text>
            <RenderHTML
                source={{
                    html,
                }}
                contentWidth={width}
            />
        </View>
    );
}
export default DrawListAttention;
