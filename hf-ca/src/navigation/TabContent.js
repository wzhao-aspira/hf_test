import { Pressable, View, Text } from "react-native";
import * as React from "react";
import { TAB_BAR_HEIGHT } from "../constants/Dimension";

const TabContent = (props) => {
    // console.log(props);
    const { state, navigation } = props;
    return (
        <View style={{ flexDirection: "row" }}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
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
                const label = route.name;

                const keyStr = `${index}_tab`;

                return (
                    <Pressable
                        key={keyStr}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            borderTopWidth: 1,
                            height: TAB_BAR_HEIGHT,
                        }}
                    >
                        <Text>{label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
};
export default TabContent;
