import { Pressable, View, Text, StyleSheet } from "react-native";
import * as React from "react";
import { Shadow } from "react-native-shadow-2";
import { TAB_BAR_HEIGHT } from "../constants/Dimension";
import AppTheme from "../assets/_default/AppTheme";
import { tabIcons, tabSelIcons } from "../constants/TabConfig";
import SVGIcon from "../components/SVGIcon";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    iconContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        borderTopWidth: 1,
        height: TAB_BAR_HEIGHT,
    },
    label: {
        ...AppTheme.typography.card_small_r,
        marginTop: 3,
    },
});

function TabContent(props) {
    const { state, navigation } = props;
    return (
        <Shadow style={{ width: "100%" }} containerStyle={styles.container} distance={8}>
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const tabIcon = isFocused ? tabSelIcons[index] : tabIcons[index];
                    const viewBoxSplit = tabIcon.viewBox.split(" ");
                    if (tabIcon.height) {
                        tabIcon.size = {
                            width: tabIcon.height * (viewBoxSplit[2] / viewBoxSplit[3]),
                            height: tabIcon.height,
                        };
                    }
                    const tabColor = isFocused ? AppTheme.colors.secondary_900 : AppTheme.colors.primary_2;
                    const keyStr = tabIcon?.name;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    return (
                        <Pressable
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={`${tabIcon?.name} Tab`}
                            testID={genTestId(tabIcon?.name)}
                            onPress={onPress}
                            style={{
                                ...styles.iconContainer,
                                borderColor: isFocused ? tabColor : AppTheme.colors.page_bg,
                            }}
                            key={keyStr}
                        >
                            <SVGIcon
                                style={{
                                    height: 25,
                                    justifyContent: "center",
                                }}
                                iconSize={tabIcon?.size}
                                pathList={tabIcon?.name}
                                viewBox={tabIcon?.viewBox}
                                fillColor={tabColor}
                            />
                            <Text
                                style={{
                                    ...styles.label,
                                    color: tabColor,
                                }}
                            >
                                {tabIcon?.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </Shadow>
    );
}
export default TabContent;
