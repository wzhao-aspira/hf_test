import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import PopupDropdown from "../../../components/PopupDropdown";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { getIdentificationTypes, getIdentificationOwners } from "../../../services/ProfileService";
import { IDENTIFICATION_OWNER_YOUTH } from "../../../constants/Constants";
import { emptyError, emptyValidate } from "./ProfileValidate";

function YouthScreen({ profile, setProfile }) {
    const { t } = useTranslation();
    const dateOfBirthRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const handleIdentificationType = (identificationType) => {
        setProfile({ ...profile, identificationType });
    };

    const [identificationOwners, setIdentificationOwners] = useState([]);
    const identificationOwnerNames = identificationOwners ? identificationOwners.map((idOwner) => idOwner.name) : [];

    const [identificationTypes, setIdentificationTypes] = useState([]);
    const [currentIdentificationTypes, setCurrentIdentificationTypes] = useState([]);

    const setCurrentIdentificationTypesWhenOwnerChanged = (selectedIdentificationOwner) => {
        const selectedIdentificationTypes =
            selectedIdentificationOwner && IDENTIFICATION_OWNER_YOUTH === selectedIdentificationOwner.id
                ? identificationTypes.adultOrYouth
                : identificationTypes.parentOrGuardian;
        setCurrentIdentificationTypes(selectedIdentificationTypes);
    };

    const changeIdentificationOwner = (index) => {
        const selectedIdentificationOwner = identificationOwners[index];
        setProfile({ ...profile, identificationOwner: selectedIdentificationOwner });
        setCurrentIdentificationTypesWhenOwnerChanged(selectedIdentificationOwner);
    };

    const getData = async () => {
        const identificationOwnersData = await getIdentificationOwners();
        setIdentificationOwners(identificationOwnersData);
        const identificationTypesData = await getIdentificationTypes();
        setIdentificationTypes(identificationTypesData);
        setCurrentIdentificationTypesWhenOwnerChanged(profile?.identificationOwner);
    };

    useEffect(() => {
        getData();
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
                    dateOfBirthRef.current.setError(emptyError);
                }}
                value={profile.dateOfBirth}
                onBlur={() => {
                    const error = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
                    dateOfBirthRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("FirstNameInput")}
                label={t("profile.firstName")}
                ref={firstNameRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(firstName) => {
                    setProfile({ ...profile, firstName });
                    firstNameRef?.current.setError(emptyError);
                }}
                value={profile.firstName}
                onBlur={() => {
                    const error = emptyValidate(profile.firstName, t("errMsg.emptyFirstName"));
                    firstNameRef?.current.setError(error);
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
            <PopupDropdown
                testID={genTestId("IdentificationOwnerDropdown")}
                label={t("profile.identificationOwner")}
                containerStyle={{ marginTop: 20 }}
                valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                options={identificationOwnerNames}
                defaultValue={profile?.identificationOwner?.name}
                onSelect={(index) => changeIdentificationOwner(index)}
            />
            {profile.identificationOwner && (
                <IdentificationTypeSelector
                    identificationTypes={currentIdentificationTypes}
                    identificationType={profile?.identificationType}
                    handleIdentificationType={handleIdentificationType}
                />
            )}
        </View>
    );
}

export default YouthScreen;
