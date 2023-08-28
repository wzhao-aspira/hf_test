import { useEffect } from "react";
import { useImmer } from "use-immer";
import { View, StyleSheet, useWindowDimensions, Text, Pressable, ScrollView } from "react-native";
import { useTranslation, Trans } from "react-i18next";
import RenderHtml from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowUpWideShort } from "@fortawesome/pro-regular-svg-icons/faArrowUpWideShort";
import { faArrowDownWideShort } from "@fortawesome/pro-regular-svg-icons/faArrowDownWideShort";
import { faCheck } from "@fortawesome/pro-regular-svg-icons/faCheck";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import AccessPermitItem from "./access_permit/AccessPermitItem";
import CommonHeader from "../../components/CommonHeader";
import { genTestId } from "../../helper/AppHelper";
import { sortHuntDays } from "../../services/AccessPermitServices";

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
    sortItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    sortItemText: {
        ...AppTheme.typography.button_text,
        marginLeft: 5,
    },
    modal: {
        zIndex: 100,
        position: "absolute",
        top: 1,
        right: 2,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: 4,
        shadowOffset: { width: 0, height: 15 },
        shadowRadius: 3,
        shadowColor: AppTheme.colors.shadow,
        shadowOpacity: 0.8,
        elevation: 15,
        paddingLeft: 10,
        paddingRight: 20,
        paddingTop: 10,
    },
});

export default function AccessPermitScreen(props) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { route } = props;
    const { accessPermitData, attention } = route.params;
    const [modalVisible, setModalVisible] = useImmer(false);
    const [ascendingOrder, setAscendingOrder] = useImmer(false);
    const [huntDays, setHuntDays] = useImmer(accessPermitData.huntDays);

    const onRightClick = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        setHuntDays((draft) => {
            sortHuntDays(draft, ascendingOrder);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ascendingOrder]);

    const renderSortItem = (text, isAscending) => (
        <Pressable
            style={styles.sortItem}
            onPress={() => {
                setModalVisible(false);
                setAscendingOrder(isAscending);
            }}
        >
            <FontAwesomeIcon
                icon={faCheck}
                size={14}
                color={ascendingOrder == isAscending ? AppTheme.colors.font_color_1 : "transparent"}
            />
            <Text
                testID={genTestId(text)}
                style={[
                    styles.sortItemText,
                    {
                        color:
                            ascendingOrder != isAscending
                                ? AppTheme.colors.question_date_picker_disable_color
                                : AppTheme.colors.font_color_1,
                    },
                ]}
            >
                {text}
            </Text>
        </Pressable>
    );
    const html = `<div style="line-height: 150%; font-size: 16px;">${attention}</div>`;
    return (
        <View style={styles.container}>
            <CommonHeader
                title={accessPermitData.name}
                rightIcon={ascendingOrder ? faArrowDownWideShort : faArrowUpWideShort}
                onRightClick={onRightClick}
            />
            <Pressable
                onPress={() => {
                    setModalVisible(false);
                }}
            >
                <ScrollView>
                    <View>
                        {modalVisible && (
                            <View style={styles.modal}>
                                {renderSortItem(t("accessPermits.latestDate"), false)}
                                {renderSortItem(t("accessPermits.earliestDate"), true)}
                            </View>
                        )}
                    </View>
                    <View style={styles.attention}>
                        <Text testID={genTestId("AttentionLabel")} style={styles.attention_label}>
                            <Trans i18nKey="common.attention" />
                        </Text>
                        <RenderHtml
                            testID={genTestId("AttentionContent")}
                            source={{
                                html,
                            }}
                            contentWidth={width}
                        />
                    </View>
                    <View style={{ flexGrow: 1, marginTop: 10, paddingBottom: insets.bottom + 50 }}>
                        {huntDays.map((item) => {
                            return (
                                <AccessPermitItem
                                    key={item.id}
                                    onPress={() => {
                                        console.log("go to detail");
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
