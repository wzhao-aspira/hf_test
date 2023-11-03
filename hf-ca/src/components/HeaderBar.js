import { View, Pressable, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/pro-light-svg-icons/faBars";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import AppTheme from "../assets/_default/AppTheme";
import { getLogo, getLogoRatio } from "../helper/ImgHelper";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        backgroundColor: AppTheme.colors.font_color_4,
    },
    logo: {
        width: 35 * getLogoRatio(),
        height: 35,
        marginLeft: DEFAULT_MARGIN,
    },
    menu: {
        paddingHorizontal: DEFAULT_MARGIN,
    },
});

function HeaderBar() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Image
                contentFit="contain"
                style={styles.logo}
                source={getLogo()}
                testID={genTestId("logo")}
                cachePolicy="none"
            />
            <Pressable
                testID={genTestId("navMenu")}
                onPress={() => {
                    navigation?.openDrawer();
                }}
                accessibilityLabel="Menu"
                style={styles.menu}
            >
                <FontAwesomeIcon icon={faBars} size={22} color={AppTheme.colors.font_color_1} />
            </Pressable>
        </View>
    );
}

export default HeaderBar;
