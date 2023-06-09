import { Pressable, ScrollView, Text } from "react-native";
import * as React from "react";

const DrawerContent = (props) => {
    // console.log(props);
    return (
        <ScrollView {...props}>
            <Pressable
                onPress={() => {
                    console.log("press drawer111");
                }}
            >
                <Text>test drawer111</Text>
            </Pressable>
        </ScrollView>
    );
};
export default DrawerContent;
