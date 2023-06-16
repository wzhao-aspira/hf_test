import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { getIdentificationTypes } from "../../../services/ProfileService";
import { emptyError, emptyValidate } from "./ProfileValidate";

function AdultScreen({ profile, setProfile }) {
    const { t } = useTranslation();
    const dateOfBirthRef = useRef();
    const lastNameRef = useRef();
    const handleIdentificationType = (identificationType) => {
        setProfile({ ...profile, identificationType });
    };
    const [identificationTypes, setIdentificationTypes] = useState([]);
    const getIdentificationTypesData = async () => {
        const identificationTypesData = await getIdentificationTypes();
        setIdentificationTypes(identificationTypesData.adultOrYouth);
    };

    useEffect(() => {
        getIdentificationTypesData();
    }, []);
    return (
        <View>
            <StatefulTextInput
                testID={genTestId("DateOfBirthInput")}
                label={t("profile.dateOfBirth")}
                ref={dateOfBirthRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(dateOfBirth) => {
                    setProfile({ ...profile, dateOfBirth });
                    dateOfBirthRef?.current.setError(emptyError);
                }}
                value={profile.dateOfBirth}
                onBlur={() => {
                    const error = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
                    dateOfBirthRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("LastNameInput")}
                label={t("profile.lastName")}
                ref={lastNameRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(lastName) => {
                    setProfile({ ...profile, lastName });
                    lastNameRef?.current.setError(emptyError);
                }}
                value={profile.lastName}
                onBlur={() => {
                    const error = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
                    lastNameRef?.current.setError(error);
                }}
            />
            <IdentificationTypeSelector
                identificationTypes={identificationTypes}
                identificationType={profile?.identificationType}
                handleIdentificationType={handleIdentificationType}
            />
        </View>
    );
}

export default AdultScreen;
