import { View, StyleSheet, useWindowDimensions, Text, Pressable, ScrollView } from "react-native";
import { Trans } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import AccessPermitItem from "./access_permit/AccessPermitItem";
import CommonHeader from "../../components/CommonHeader";
import RenderHTML from "../../components/RenderHTML";
import { genTestId } from "../../helper/AppHelper";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
    attention: {
        marginHorizontal: DEFAULT_MARGIN,
    },
    attention_label: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
        marginTop: 30,
        marginBottom: 5,
    },
});

export default function AccessPermitScreen(props) {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { route } = props;
    const { accessPermitData, attention, customer } = route.params;
    const { huntDays } = accessPermitData;

    const html = attention;
    return (
        <View style={styles.container}>
            <CommonHeader title={accessPermitData?.name} />
            <Pressable>
                <ScrollView>
                    <View style={styles.attention}>
                        <Text testID={genTestId("AttentionLabel")} style={styles.attention_label}>
                            <Trans i18nKey="common.attention" />
                        </Text>
                        <RenderHTML
                            testID={genTestId("AttentionContent")}
                            source={{
                                html,
                            }}
                            contentWidth={width}
                        />
                    </View>
                    <View style={{ flexGrow: 1, marginTop: 15, paddingBottom: insets.bottom + 50 }}>
                        {huntDays.map((item) => {
                            return (
                                <AccessPermitItem
                                    key={item.id}
                                    onPress={() => {
                                        NavigationService.navigate(Routers.accessPermitDetail, {
                                            document: {
                                                title: accessPermitData?.name,
                                                huntDate: item.huntDayForDetail,
                                                huntRange: item.huntDay,
                                                huntCode: item.huntCode,
                                                isGeneratedDraw: item.isGeneratedDraw,
                                                huntName: item.huntName,
                                                reservationNumber: item.drawnSequence,
                                                barcode: customer.goId,
                                                name: customer.name,
                                                address: customer.address,
                                                fileInfoList: item.fileInfoList,
                                                isDisplayReservation: item.isDisplayReservation,
                                            },
                                        });
                                    }}
                                    itemData={item}
                                    itemKey={item.id}
                                />
                            );
                        })}
                    </View>
                </ScrollView>
            </Pressable>
        </View>
    );
}
