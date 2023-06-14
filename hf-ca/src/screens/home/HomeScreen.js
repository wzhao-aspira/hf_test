import React from "react";
import { View } from "react-native";
import PrimaryBtn from "../../components/PrimaryBtn";
import HeaderBar from "../../components/HeaderBar";
import WelcomeBar from "../../components/WelcomeBar";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <HeaderBar />
            <WelcomeBar firstName="Hannah" />
            <PrimaryBtn
                onPress={() => {
                    console.log("111");
                }}
                label="home btn"
            />
        </View>
    );
}
