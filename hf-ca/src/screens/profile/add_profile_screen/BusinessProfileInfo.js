import React, { useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import AppTheme from "../../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "./ProfileValidate";

function BusinessProfileInfo({ profile, setProfile }) {
    const { t } = useTranslation();
    const goIDNumberRef = useRef();
    const postalCodeNumberRef = useRef();
    return (
        <View>
            <StatefulTextInput
                testID={genTestId("BusinessGOIDNumberInput")}
                label={t("profile.businessGOIDNumber")}
                ref={goIDNumberRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(goIDNumber) => {
                    setProfile({ ...profile, goIDNumber });
                    goIDNumberRef.current.setError(emptyError);
                }}
                value={profile.goIDNumber}
                onBlur={() => {
                    const error = emptyValidate(profile.goIDNumber, t("errMsg.emptyBusinessGOIDNumber"));
                    goIDNumberRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("PostalCodeNumberInput")}
                label={t("profile.postalCodeNumber")}
                ref={postalCodeNumberRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(postalCodeNumber) => {
                    setProfile({ ...profile, postalCodeNumber });
                    postalCodeNumberRef.current.setError(emptyError);
                }}
                value={profile.postalCodeNumber}
                onBlur={() => {
                    const error = emptyValidate(profile.postalCodeNumber, t("errMsg.emptyPostalCodeNumber"));
                    postalCodeNumberRef?.current.setError(error);
                }}
            />
        </View>
    );
}

export default BusinessProfileInfo;
