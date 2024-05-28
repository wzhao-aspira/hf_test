import { Pressable, View, Text, StyleSheet } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TAB_BAR_HEIGHT } from "../constants/Dimension";
import AppTheme from "../assets/_default/AppTheme";
import tabIcons from "../constants/TabConfig";
import { genTestId } from "../helper/AppHelper";
import Routers from "../constants/Routers";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import { selectMobileAppAlertUnreadCount } from "../redux/MobileAppAlertSelector";
import { useSelector } from "react-redux";
import { appConfig } from "../services/AppConfigService";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    iconContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        borderTopWidth: 1,
        height: TAB_BAR_HEIGHT,
    },
    label: {
        ...AppTheme.typography.card_small_r,
        marginTop: 3,
    },
    exclaimationMark: {
        position: "absolute",
        right: 24,
        top: 5,
    },
});

export const TabState = {
    currentTabIndex: 0,
};

function ExclaimationMarkForHamburger() {
    const mobileAppAlertUnreadCount = useSelector(selectMobileAppAlertUnreadCount);

    const { mobileAppAlertsEnabled } = appConfig.data;
    if (!mobileAppAlertsEnabled) {
        return null;
    }
    const shouldShowExclaimationMark = mobileAppAlertUnreadCount > 0;
    return (
        shouldShowExclaimationMark && (
            <FontAwesomeIcon style={styles.exclaimationMark} color="red" icon={faCircleExclamation} size={16} />
        )
    );
}

function TabContent(props) {
    const { state, navigation } = props;

    return (
        <Shadow style={{ width: "100%" }} containerStyle={styles.container} distance={8}>
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const tabIcon = isFocused ? tabIcons[index] : tabIcons[index];

                    const tabColor = isFocused ? AppTheme.colors.secondary_900 : AppTheme.colors.primary_2;
                    const keyStr = tabIcon?.id;

                    const isHamburgerMenu = route.name === Routers.menu;
                    const onPress = () => {
                        if (isHamburgerMenu) {
                            navigation?.openDrawer();
                            return;
                        }
                        TabState.currentTabIndex = index;

                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved

                            navigation.navigate({
                                name: route.name,
                                merge: true,
                                params: {
                                    screen: route.name,
                                },
                            });
                        }
                    };

                    return (
                        <Pressable
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={`${tabIcon?.label} Tab`}
                            testID={genTestId(tabIcon?.id)}
                            onPress={onPress}
                            style={{
                                ...styles.iconContainer,
                                borderColor: isFocused ? tabColor : AppTheme.colors.page_bg,
                            }}
                            key={keyStr}
                        >
                            {isHamburgerMenu && <ExclaimationMarkForHamburger />}
                            <FontAwesomeIcon
                                color={tabColor}
                                icon={isFocused ? tabIcon.selected : tabIcon.unselected}
                                size={24}
                            />
                            {tabIcon?.label && (
                                <Text
                                    style={{
                                        ...styles.label,
                                        color: tabColor,
                                    }}
                                >
                                    {tabIcon?.label}
                                </Text>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </Shadow>
    );
}
export default TabContent;
