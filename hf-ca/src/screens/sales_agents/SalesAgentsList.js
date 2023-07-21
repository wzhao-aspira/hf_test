import { faMapMarker } from "@fortawesome/pro-light-svg-icons";
import { FlatList } from "react-native-gesture-handler";
import { View, StyleSheet, Text, Linking } from "react-native";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BtnSizeEnum, BtnTypeEnum } from "../../constants/Constants";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import ConfirmButton from "../../components/ConfirmButton";
import SalesAgentsListLoading from "./SalesAgentsListLoading";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    shadowBox: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginTop: 3,
        marginBottom: 20,
        marginHorizontal: DEFAULT_MARGIN,
        flexDirection: "row",
    },
    indexLabel: {
        ...AppTheme.typography.card_small_m,
        color: AppTheme.colors.font_color_1,
        position: "absolute",
        top: 5,
    },
    contentContainer: {
        marginLeft: 10,
        marginRight: DEFAULT_MARGIN,
        alignItems: "flex-start",
    },
    titleLabel: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    addressLabel: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_2,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    noResultContainer: {
        padding: DEFAULT_MARGIN,
    },
});

export function SalesAgentsItem({ item, index, onDirectionsClick }) {
    return (
        <View style={styles.shadowBox}>
            <View style={{ alignItems: "center" }}>
                <FontAwesomeIcon icon={faMapMarker} size={30} color={AppTheme.colors.primary} />
                <Text testID={genTestId(`Agent${index + 1}`)} style={styles.indexLabel}>
                    {index + 1}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                <Text testID={genTestId(`Agent${index + 1}Name`)} style={styles.titleLabel}>
                    {item.name}
                </Text>
                <Text testID={genTestId(`Agent${index + 1}Address`)} style={styles.addressLabel}>
                    {item.address}, {item.city}, {item.zip}
                </Text>
                <Text testID={genTestId(`Agent${index + 1}DistanceUnit`)} style={styles.addressLabel}>
                    {item.distance} {item.distanceUnit.toLowerCase()}
                    (s)
                </Text>
                <View style={styles.bottomContainer}>
                    {!isEmpty(item.phoneNumber) && (
                        <ConfirmButton
                            testID="Call"
                            style={{ marginRight: 20 }}
                            size={BtnSizeEnum.Small}
                            type={BtnTypeEnum.Secondary}
                            label="salesAgents.call"
                            onPress={() => {
                                Linking.openURL(`tel:${item.phoneNumber}`).catch((error) => {
                                    console.log(`can not open:------${error}`);
                                });
                            }}
                        />
                    )}
                    <ConfirmButton
                        testID="Directions"
                        label="salesAgents.directions"
                        size={BtnSizeEnum.Small}
                        type={BtnTypeEnum.Primary}
                        onPress={() => {
                            if (onDirectionsClick) {
                                onDirectionsClick(item);
                            }
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

export default function SalesAgentsList(props) {
    const { loading, salesAgents, onDirectionsClick } = props;

    if (loading) {
        return <SalesAgentsListLoading />;
    }
    if (!isEmpty(salesAgents)) {
        return (
            <FlatList
                style={{ marginTop: 90 }}
                data={salesAgents}
                renderItem={({ item, index }) => {
                    return <SalesAgentsItem item={item} index={index} onDirectionsClick={onDirectionsClick} />;
                }}
                keyExtractor={(item, index) => `${item}${index}`}
            />
        );
    }
    return <View style={styles.noResultContainer} />;
}
