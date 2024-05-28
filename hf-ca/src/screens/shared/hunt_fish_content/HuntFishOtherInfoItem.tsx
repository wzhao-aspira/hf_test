import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { View, StyleSheet, Text, Pressable } from "react-native";
import AppTheme from "../../../assets/_default/AppTheme";
import { genTestId } from "../../../helper/AppHelper";
import { ExclaimerWithNumber } from "../../../components/ExclaimerWithNumber";

export const styles = StyleSheet.create({
    otherInfoItem: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-end",
    },
    otherInfoTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginRight: 10,
    },
    otherInfoTitleContainer: {
        marginVertical: 18,
        marginLeft: 16,
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
    otherInfoRightArrow: {
        marginLeft: 5,
        marginRight: 16,
        alignSelf: "center",
    },
    otherInfoLine: {
        backgroundColor: AppTheme.colors.page_bg,
        height: StyleSheet.hairlineWidth,
        width: "100%",
    },
});
interface HuntFishOtherInfoItemProps {
    title: string;
    onPress: () => unknown;
    showExclaimer?: boolean;
    exclaimerNumber?: number;
}
function HuntFishOtherInfoItem(props: HuntFishOtherInfoItemProps) {
    const { title, onPress, exclaimerNumber, showExclaimer } = props;
    return (
        <View>
            <Pressable
                testID={genTestId(title)}
                onPress={() => {
                    console.log("other info item tapped");
                    onPress();
                }}
            >
                <View style={styles.otherInfoItem}>
                    <View style={styles.otherInfoTitleContainer}>
                        <View>
                            <Text style={styles.otherInfoTitle} testID={genTestId(`${title}-label`)}>
                                {title}
                            </Text>
                        </View>
                        {showExclaimer && <ExclaimerWithNumber number={exclaimerNumber} />}
                    </View>
                    <FontAwesomeIcon
                        style={styles.otherInfoRightArrow}
                        icon={faChevronRight}
                        size={15}
                        color={AppTheme.colors.primary_2}
                    />
                </View>
            </Pressable>

            <View style={styles.otherInfoLine} />
        </View>
    );
}

export default HuntFishOtherInfoItem;
