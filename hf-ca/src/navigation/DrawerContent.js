import { Pressable, ScrollView, Text } from "react-native";
import * as React from "react";
import AppTheme from "../assets/_default/AppTheme";

const DrawerContent = (props) => {
    // console.log(props);
    return (
        <ScrollView {...props} style={{ backgroundColor: AppTheme.colors.page_bg }}>
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
