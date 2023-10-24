import { Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import RenderHtml from "react-native-render-html";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId, isIos } from "../../../helper/AppHelper";
import RegulationItemView from "./RegulationItemView";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";

const styles = StyleSheet.create({
    tableContainer: {
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: DEFAULT_MARGIN,
    },
    linkButton: {
        width: "100%",
        marginTop: 5,
    },
    linkButtonText: {
        ...AppTheme.typography.overlay_sub_text,
        textDecorationLine: "underline",
        color: AppTheme.colors.fishing_blue,
    },
    regulationDescription: {
        width: "100%",
        marginBottom: 5,
    },
});

function LinkButton({ text, href }) {
    return (
        <View style={styles.linkButton}>
            <Pressable
                onPress={() => {
                    if (!isEmpty(href)) {
                        Linking.openURL(href);
                    }
                }}
            >
                <Text style={styles.linkButtonText}>{text}</Text>
            </Pressable>
        </View>
    );
}

function RegulationListDataView({ data }) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const { regulationDescription, cdfwRegulationsLink, iosRegulationApp, androidRegulationApp, regulationList } = data;

    const appDownloadURLString = isIos() ? iosRegulationApp : androidRegulationApp;

    return (
        <View style={styles.tableContainer}>
            <View style={{ marginBottom: 25 }}>
                {regulationDescription && (
                    <View style={styles.regulationDescription}>
                        <RenderHtml
                            testID={genTestId("regulationDescription")}
                            source={{
                                html: regulationDescription,
                            }}
                            contentWidth={width}
                        />
                    </View>
                )}
                {!isEmpty(appDownloadURLString) && (
                    <LinkButton text={t("regulation.downloadRegulationApp")} href={appDownloadURLString} />
                )}
                {!isEmpty(cdfwRegulationsLink) && (
                    <LinkButton text={t("regulation.visitRegulationSite")} href={cdfwRegulationsLink} />
                )}
            </View>

            {regulationList.map((item, index) => {
                console.log(`regulation item:${JSON.stringify(item)}`);
                return (
                    <RegulationItemView
                        key={item.regulationId}
                        itemData={item}
                        itemIndex={index + 1}
                        onPress={() => {
                            console.log("click regulation item");
                            NavigationService.navigate(Routers.regulationDetail, { regulation: item });
                        }}
                    />
                );
            })}
        </View>
    );
}

export default RegulationListDataView;
