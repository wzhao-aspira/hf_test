import React, { useRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import StatefulTextInput from "../../../components/StatefulTextInput";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "./ProfileValidate";
import { DEFAULT_DATE_FORMAT } from "../../../constants/Constants";
import HfDatePicker from "../../../components/HfDatePicker";

const AdultProfileInfo = React.forwardRef(({ profile, setProfile, identificationTypes }, ref) => {
    const { t } = useTranslation();
    const dateOfBirthRef = useRef();
    const lastNameRef = useRef();
    const identificationTypeSelectorRef = useRef();
    const handleIdentificationType = (identificationType) => {
        setProfile({ ...profile, identificationType });
    };
    const validate = () => {
        const errorOfLastName = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
        lastNameRef?.current.setError(errorOfLastName);
        const errorOfDateOfBirth = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
        dateOfBirthRef?.current.setError(errorOfDateOfBirth);
        const identificationTypeErrorReported = identificationTypeSelectorRef.current.validate();
        return errorOfLastName.error || errorOfDateOfBirth.error || identificationTypeErrorReported;
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
                hint={DEFAULT_DATE_FORMAT}
                style={{ marginTop: 20 }}
                onConfirm={(date) => {
                    const dateOfBirth = moment(date).format(DEFAULT_DATE_FORMAT);
                    setProfile({ ...profile, dateOfBirth });
                }}
                value={profile.dateOfBirth}
                validate={(date) => {
                    return emptyValidate(date, t("errMsg.emptyDateOfBirth"));
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
            <IdentificationTypeSelector
                ref={identificationTypeSelectorRef}
                identificationTypes={identificationTypes}
                identificationType={profile?.identificationType}
                handleIdentificationType={handleIdentificationType}
            />
        </View>
    );
});

export default AdultProfileInfo;
