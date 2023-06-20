import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { isEmpty } from "lodash";
import { Trans } from "react-i18next";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import PaginationDot from "react-native-animated-pagination-dot";
import AppTheme from "../../../assets/_default/AppTheme";
import HomeStyles from "../HomeStyles";
import NavigationService from "../../../navigation/NavigationService";
import LicenseEmpty from "./LicenseEmpty";
import CarouselItem from "./CarouselItem";
import Routers from "../../../constants/Routers";
import { genTestId } from "../../../helper/AppHelper";

const styles = StyleSheet.create({
    viewAllContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

const HomeLicenseSection = (props) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { licenses } = props;
    const isLicensesEmpty = isEmpty(licenses);

    return (
        <View>
            <View style={HomeStyles.sectionTitleContainer}>
                <Text testID={genTestId("myLicense")} style={HomeStyles.sectionTitle}>
                    <Trans i18nKey="license.myLicense" />
                </Text>
                {!isLicensesEmpty && (
                    <View style={styles.viewAllContainer}>
                        <Text
                            testID={genTestId("viewAllLicenses")}
                            style={HomeStyles.viewAllLabel}
                            onPress={() => {
                                NavigationService.navigate(Routers.licenseList);
                            }}
                        >
                            <Trans i18nKey="license.viewAllLicenses" />
                        </Text>
                        <FontAwesomeIcon icon={faChevronRight} size={15} color={AppTheme.colors.primary_2} />
                    </View>
                )}
            </View>
            {isLicensesEmpty ? (
                <LicenseEmpty />
            ) : (
                <View style={{ marginTop: -3 }}>
                    <CarouselItem licenses={licenses} setActiveSlide={setActiveSlide} />
                    {licenses?.length > 1 && (
                        <View style={{ alignItems: "center" }}>
                            <PaginationDot
                                testID={genTestId("paginationDot")}
                                inactiveDotColor={AppTheme.colors.primary_2}
                                activeDotColor={AppTheme.colors.primary}
                                curPage={activeSlide}
                                maxPage={licenses.length}
                                sizeRatio={1.2}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default HomeLicenseSection;
