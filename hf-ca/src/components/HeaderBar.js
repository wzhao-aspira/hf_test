import { View, StyleSheet, Image } from "react-native";
import AppTheme from "../assets/_default/AppTheme";
import { getLogo, getLogoRatio } from "../helper/ImgHelper";
import { DEFAULT_MARGIN } from "../constants/Dimension";
import { genTestId } from "../helper/AppHelper";
import SwitchCustomer from "./SwitchCustomer";

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
    switchContainer: {
        width: 110,
        marginRight: DEFAULT_MARGIN,
    },
});

function HeaderBar({ showSwitchCust = false }) {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={getLogo()} testID={genTestId("logo")} />
            {showSwitchCust && (
                <View style={styles.switchContainer}>
                    <SwitchCustomer />
                </View>
            )}
        </View>
    );
}

export default HeaderBar;
