import { isEmpty } from "lodash";
import React, { useRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import StatefulTextInput from "../../../components/StatefulTextInput";
import PopupDropdown from "../../../components/PopupDropdown";
import HfDatePicker from "../../../components/HfDatePicker";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { IDENTIFICATION_OWNER_YOUTH, DATE_OF_BIRTH_FORMAT } from "../../../constants/Constants";
import { emptyError, emptyValidate } from "./ProfileValidate";

const YouthProfileInfo = React.forwardRef(
    (
        {
            profile,
            setProfile,
            identificationOwners,
            allIdentificationTypes,
            identificationTypes,
            setIdentificationTypes,
        },
        ref
    ) => {
        const { t } = useTranslation();
        const dateOfBirthRef = useRef();
        const firstNameRef = useRef();
        const lastNameRef = useRef();
        const identificationTypeSelectorRef = useRef();
        const handleIdentificationType = (identificationType) => {
            setProfile({ ...profile, identificationType });
        };

        const setCurrentIdentificationTypesWhenOwnerChanged = (selectedIdentificationOwner) => {
            const selectedIdentificationTypes =
                selectedIdentificationOwner && IDENTIFICATION_OWNER_YOUTH === selectedIdentificationOwner.id
                    ? allIdentificationTypes.adultOrYouth
                    : allIdentificationTypes.parentOrGuardian;
            setIdentificationTypes(selectedIdentificationTypes);
            setProfile({
                ...profile,
                identificationOwner: selectedIdentificationOwner,
                identificationType: !isEmpty(selectedIdentificationTypes) ? selectedIdentificationTypes[0] : {},
            });
        };

        const changeIdentificationOwner = (index) => {
            const selectedIdentificationOwner = identificationOwners[index];
            setCurrentIdentificationTypesWhenOwnerChanged(selectedIdentificationOwner);
        };

        const validate = () => {
            const errorOfFirstName = emptyValidate(profile.firstName, t("errMsg.emptyFirstName"));
            firstNameRef?.current.setError(errorOfFirstName);
            const errorOfLastName = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
            lastNameRef?.current.setError(errorOfLastName);
            const errorOfDateOfBirth = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
            dateOfBirthRef?.current.setError(errorOfDateOfBirth);
            const identificationTypeErrorReported = identificationTypeSelectorRef.current?.validate();
            return (
                errorOfFirstName.error ||
                errorOfLastName.error ||
                errorOfDateOfBirth.error ||
                identificationTypeErrorReported
            );
        };
        useImperativeHandle(ref, () => ({
            validate,
        }));

        return (
            <View>
                <HfDatePicker
                    testID="DateOfBirth"
                    label={t("profile.dateOfBirth")}
                    ref={dateOfBirthRef}
                    hint={DATE_OF_BIRTH_FORMAT}
                    style={{ marginTop: 20 }}
                    onConfirm={(date) => {
                        const dateOfBirth = moment(date).format(DATE_OF_BIRTH_FORMAT);
                        setProfile({ ...profile, dateOfBirth });
                    }}
                    value={profile.dateOfBirth}
                    validate={(date) => {
                        return emptyValidate(date, t("errMsg.emptyDateOfBirth"));
                    }}
                />
                <StatefulTextInput
                    testID="FirstName"
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
                    testID="LastName"
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
                    testID="IdentificationOwner"
                    label={t("profile.identificationOwner")}
                    containerStyle={{ marginTop: 20 }}
                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    options={identificationOwners}
                    value={profile?.identificationOwner?.name}
                    onSelect={(index) => changeIdentificationOwner(index)}
                />
                {profile.identificationOwner && (
                    <IdentificationTypeSelector
                        ref={identificationTypeSelectorRef}
                        identificationTypes={identificationTypes}
                        identificationType={profile?.identificationType}
                        handleIdentificationType={handleIdentificationType}
                    />
                )}
            </View>
        );
    }
);

export default YouthProfileInfo;
