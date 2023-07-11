import { startsWith, isEmpty } from "lodash";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginHorizontal: DEFAULT_MARGIN,
        justifyContent: "space-between",
    },
    labelWrapper: {
        borderBottomWidth: 2,
        borderBottomColor: AppTheme.colors.primary,
        paddingBottom: 2,
    },
    labelStyle: {
        ...AppTheme.typography.sub_section,
        color: AppTheme.colors.font_color_1,
    },
    selLabelStyle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
});

export default function WeekItem(props) {
    const { testID = "", label, selLabel = label[0], onPress = () => {} } = props;

    if (!isEmpty(label) && label.length < 5) {
        for (let i = 0; i < 5 - label.length + 1; i++) {
            label.push(`test_${i}`);
        }
    }

    return (
        <View style={styles.container}>
            {label.map((item, index) => {
                const sel = item == selLabel;
                return (
                    <Pressable
                        testID={genTestId(`${testID}WeekItem${index + 1}Button`)}
                        key={item}
                        onPress={() => {
                            onPress(item);
                        }}
                    >
                        <View style={[sel ? styles.labelWrapper : null]}>
                            {!startsWith(item, "test_") && (
                                <Text
                                    testID={genTestId(`${testID}WeekItem${index + 1}Label`)}
                                    style={[sel ? styles.selLabelStyle : styles.labelStyle]}
                                >
                                    {item}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}
