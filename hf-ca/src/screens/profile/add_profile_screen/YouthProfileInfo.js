import { isEmpty } from "lodash";
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import PopupDropdown from "../../../components/PopupDropdown";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { getIdentificationTypes, getIdentificationOwners } from "../../../services/ProfileService";
import { IDENTIFICATION_OWNER_YOUTH, DATE_OF_BIRTH_PLACEHOLDER } from "../../../constants/Constants";
import { emptyError, emptyValidate } from "./ProfileValidate";

const YouthProfileInfo = React.forwardRef(({ profile, setProfile }, ref) => {
    const { t } = useTranslation();
    const dateOfBirthRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const identificationTypeSelectorRef = useRef();
    const handleIdentificationType = (identificationType) => {
        setProfile({ ...profile, identificationType });
    };
    const [identificationOwners, setIdentificationOwners] = useState([]);
    const identificationOwnerNames = identificationOwners ? identificationOwners.map((idOwner) => idOwner.name) : [];

    const [identificationTypes, setIdentificationTypes] = useState([]);
    const [currentIdentificationTypes, setCurrentIdentificationTypes] = useState([]);
    const [identificationTypeChanged, setIdentificationTypeChanged] = useState(true);
    const setCurrentIdentificationTypesWhenOwnerChanged = (selectedIdentificationOwner) => {
        const selectedIdentificationTypes =
            selectedIdentificationOwner && IDENTIFICATION_OWNER_YOUTH === selectedIdentificationOwner.id
                ? identificationTypes.adultOrYouth
                : identificationTypes.parentOrGuardian;
        setCurrentIdentificationTypes(selectedIdentificationTypes);
        setProfile({
            ...profile,
            identificationOwner: selectedIdentificationOwner,
            identificationType: !isEmpty(selectedIdentificationTypes) ? selectedIdentificationTypes[0] : {},
        });
        console.log();
        setIdentificationTypeChanged(false);
        setTimeout(() => setIdentificationTypeChanged(true), 0);
        identificationTypeSelectorRef.current?.validate();
    };

    const changeIdentificationOwner = (index) => {
        const selectedIdentificationOwner = identificationOwners[index];
        setCurrentIdentificationTypesWhenOwnerChanged(selectedIdentificationOwner);
    };

    const getData = async () => {
        const identificationOwnersData = await getIdentificationOwners();
        setIdentificationOwners(identificationOwnersData);
        const identificationTypesData = await getIdentificationTypes();
        setIdentificationTypes(identificationTypesData);
        setCurrentIdentificationTypesWhenOwnerChanged(profile?.identificationOwner);
        setCurrentIdentificationTypes(identificationTypesData.adultOrYouth);
    };
    const validate = () => {
        const errorOfFirstName = emptyValidate(profile.firstName, t("errMsg.emptyFirstName"));
        firstNameRef?.current.setError(errorOfFirstName);
        const errorOfLastName = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
        lastNameRef?.current.setError(errorOfLastName);
        const errorOfDateOfBirth = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
        dateOfBirthRef?.current.setError(errorOfDateOfBirth);
        const errorIdentificationType = identificationTypeSelectorRef.current?.validate();
        return (
            errorOfFirstName.error || errorOfLastName.error || errorOfDateOfBirth.error || errorIdentificationType.error
        );
    };
    useImperativeHandle(ref, () => ({
        validate,
    }));
    useEffect(() => {
        getData();
    }, []);

    return (
        <View>
            <StatefulTextInput
                testID={genTestId("DateOfBirthInput")}
                label={t("profile.dateOfBirth")}
                ref={dateOfBirthRef}
                hint={DATE_OF_BIRTH_PLACEHOLDER}
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
                hint={t("common.pleaseEnter")}
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
                hint={t("common.pleaseEnter")}
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
                defaultValue={profile?.identificationOwner?.name || identificationOwnerNames[0]}
                onSelect={(index) => changeIdentificationOwner(index)}
            />
            {profile.identificationOwner && (
                <IdentificationTypeSelector
                    ref={identificationTypeSelectorRef}
                    identificationTypes={currentIdentificationTypes}
                    identificationType={profile?.identificationType}
                    handleIdentificationType={handleIdentificationType}
                    identificationTypeChanged={identificationTypeChanged}
                />
            )}
        </View>
    );
});

export default YouthProfileInfo;
