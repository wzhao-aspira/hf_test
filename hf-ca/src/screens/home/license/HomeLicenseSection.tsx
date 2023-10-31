import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { isEmpty } from "lodash";
import { Trans } from "react-i18next";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AppTheme from "../../../assets/_default/AppTheme";
import HomeStyles from "../HomeStyles";
import NavigationService from "../../../navigation/NavigationService";
import LicenseEmpty from "./LicenseEmpty";
import CarouselItem from "./CarouselItem";
import Routers from "../../../constants/Routers";
import { genTestId } from "../../../helper/AppHelper";

import type { License } from "../../../types/license";

const styles = StyleSheet.create({
    viewAllContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

interface HomeLicenseSectionProps {
    licenses: License[];
}

function HomeLicenseSection(props: HomeLicenseSectionProps) {
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
                            <Text>
                                {activeSlide + 1} of {licenses.length}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default HomeLicenseSection;
