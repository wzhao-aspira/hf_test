import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginStep from "../../constants/LoginStep";
import { updateLoginStep } from "../../redux/AppSlice";
import PrimaryBtn from "../../components/PrimaryBtn";
import AppContract from "../../assets/_default/AppContract";
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import { getLoginSplash, getLogo, getLogoRatio } from "../../helper/ImgHelper";
import SplitLine from "../../components/SplitLine";
import OutlinedBtn from "../../components/OutlinedBtn";

const logoWidth = 90;
const logoHeight = logoWidth / getLogoRatio();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
    },
    logo: {
        position: "absolute",
        left: "50%",
        right: "50%",
        width: logoWidth,
        height: logoHeight,
    },
    loginArea: {
        padding: 40,
        justifyContent: "center",
        flexGrow: 1,
    },
    loginAreaContainer: {
        position: "absolute",
        bottom: 0,
        backgroundColor: AppTheme.colors.page_bg,
        width: "100%",
        height: SCREEN_HEIGHT / 2,
    },
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_1,
        lineHeight: 35,
        marginBottom: 10,
    },
    subTitle: {
        ...AppTheme.typography.sub_text,
        color: AppTheme.colors.font_color_2,
        marginBottom: 36,
    },
});

export default function LoginScreen() {
    const dispatch = useDispatch();
    const inset = useSafeAreaInsets();
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const loginSplash = await getLoginSplash();
            setImage(loginSplash);
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Image contentPosition="top" style={styles.image} source={image} contentFit="contain" transition={200} />
            <Image
                style={[
                    styles.logo,
                    {
                        transform: [{ translateY: inset?.top + DEFAULT_MARGIN / 2 }, { translateX: -logoWidth / 2 }],
                    },
                ]}
                contentFit="contain"
                source={getLogo()}
            />

            <ScrollView style={styles.loginAreaContainer} bounces={false} contentContainerStyle={styles.loginArea}>
                <View>
                    <Text style={styles.title}>{AppContract.strings.splash_title}</Text>
                    <SplitLine style={{ backgroundColor: AppTheme.colors.font_color_1 }} />
                    <Text style={styles.subTitle}>{AppContract.strings.splash_sub_title}</Text>
                    <PrimaryBtn
                        label={AppContract.strings.sign_in}
                        onPress={() => dispatch(updateLoginStep(LoginStep.home))}
                    />
                    <OutlinedBtn
                        style={{ marginTop: 20 }}
                        label={AppContract.strings.create_account}
                        onPress={() => {
                            console.log("create account");
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
