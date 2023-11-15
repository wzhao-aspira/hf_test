import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
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
});

function HeaderBar() {
    return (
        <View style={styles.container}>
            <Image
                contentFit="contain"
                style={styles.logo}
                source={getLogo()}
                testID={genTestId("logo")}
                cachePolicy="none"
            />
        </View>
    );
}

export default HeaderBar;
