import React from "react";
import { View } from "react-native";
import PrimaryBtn from "../../components/PrimaryBtn";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <PrimaryBtn
                onPress={() => {
                    console.log("111");
                }}
                label="home btn"
            />
        </View>
    );
}
