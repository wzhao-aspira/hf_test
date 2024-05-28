import { StyleSheet, View, Text, Pressable } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";

import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";

export const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        marginHorizontal: DEFAULT_MARGIN,
        justifyContent: "center",
    },
    emptyArea: {
        marginTop: -100,
        width: "100%",
    },
    emptyTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
    emptyDescription: {
        marginTop: 8,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        textAlign: "center",
    },
    emptyButton: {
        marginTop: 22,
        backgroundColor: AppTheme.colors.primary_2,
        width: "100%",
        height: 52,
        borderRadius: 5,
        justifyContent: "center",
    },
    emptyButtonTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
    },
});
interface EmptyContentProps {
    title: string;
    subtitle: string;
    showButton: boolean;
    buttonText?: string;
    onButtonPress?: () => unknown;
}
export function EmptyContent(props: EmptyContentProps) {
    const { title, subtitle, showButton, onButtonPress, buttonText } = props;

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyArea}>
                <Text testID={genTestId("emptyContentTitle")} style={styles.emptyTitle}>
                    {title}
                </Text>
                <Text testID={genTestId("emptyContentSubtitle")} style={styles.emptyDescription}>
                    {subtitle}
                </Text>
                {showButton && (
                    <Pressable
                        style={styles.emptyButton}
                        testID={genTestId("emptyContent")}
                        onPress={() => {
                            onButtonPress?.();
                        }}
                    >
                        <Text testID={genTestId("emptyContentBtn")} style={styles.emptyButtonTitle}>
                            {buttonText}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
