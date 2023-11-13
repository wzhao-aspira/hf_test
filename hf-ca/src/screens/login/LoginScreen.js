import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import LoginStep from "../../constants/LoginStep";
import { updateLoginStep } from "../../redux/AppSlice";
import PrimaryBtn from "../../components/PrimaryBtn";
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import { getLogo, getLoginSplash, getLogoRatio } from "../../helper/ImgHelper";
import SplitLine from "../../components/SplitLine";
import OutlinedBtn from "../../components/OutlinedBtn";
import { appConfig } from "../../services/AppConfigService";

const logoWidth = 90;
const logoHeight = logoWidth / getLogoRatio();

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        height: SCREEN_HEIGHT * 0.5,
    },
    image: {
        width: "100%",
        height: "100%",
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
    },
    loginAreaContainer: {
        backgroundColor: AppTheme.colors.page_bg,
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
    const { t } = useTranslation();

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
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={image} contentFit="cover" transition={200} cachePolicy="none" />
            </View>
            <Image
                cachePolicy="none"
                style={[
                    styles.logo,
                    {
                        transform: [{ translateY: inset.top + DEFAULT_MARGIN / 2 }, { translateX: -logoWidth / 2 }],
                    },
                ]}
                contentFit="contain"
                source={getLogo()}
            />

            <ScrollView
                style={styles.loginAreaContainer}
                bounces={false}
                contentContainerStyle={styles.loginArea}
                showsVerticalScrollIndicator={false}
            >
                <>
                    <Text style={styles.title}>{t("login.splashTitle")}</Text>
                    <SplitLine style={{ backgroundColor: AppTheme.colors.font_color_1 }} />
                    <Text style={styles.subTitle}>{appConfig.data?.welcomeWords}</Text>
                    <PrimaryBtn
                        testID="signInBtn"
                        label={t("login.signIn")}
                        onPress={() => dispatch(updateLoginStep(LoginStep.signIn))}
                    />
                    <OutlinedBtn
                        testID="signUpBtn"
                        style={{ marginTop: 20 }}
                        label={t("login.createAccount")}
                        onPress={() => dispatch(updateLoginStep(LoginStep.signUp))}
                    />
                </>
            </ScrollView>
        </View>
    );
}
