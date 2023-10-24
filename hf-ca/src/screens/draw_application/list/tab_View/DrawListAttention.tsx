import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Trans } from "react-i18next";
import RenderHTML from "react-native-render-html";
import { genTestId } from "../../../../helper/AppHelper";
import AppTheme from "../../../../assets/_default/AppTheme";

const styles = StyleSheet.create({
    attention_container: {
        marginBottom: 10,
    },
    attention_label: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
        marginTop: 10,
        marginBottom: 10,
    },
});
function DrawListAttention({ html }) {
    const { width } = useWindowDimensions();

    return (
        <View style={styles.attention_container}>
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
