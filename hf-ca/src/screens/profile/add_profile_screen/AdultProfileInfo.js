import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import IdentificationTypeSelector from "./IdentificationTypeSelector";
import AppTheme from "../../../assets/_default/AppTheme";
import { getIdentificationTypes } from "../../../services/ProfileService";
import { emptyError, emptyValidate } from "./ProfileValidate";
import { DATE_OF_BIRTH_PLACEHOLDER } from "../../../constants/Constants";

const AdultProfileInfo = React.forwardRef(({ profile, setProfile }, ref) => {
    const { t } = useTranslation();
    const dateOfBirthRef = useRef();
    const lastNameRef = useRef();
    const identificationTypeSelectorRef = useRef();
    const handleIdentificationType = (identificationType) => {
        setProfile({ ...profile, identificationType });
    };
    // const selectOneLabel = t("profile.selectOne");
    const [identificationTypes, setIdentificationTypes] = useState([]);
    const getIdentificationTypesData = async () => {
        const identificationTypesData = await getIdentificationTypes();
        // const idTypes = [{ id: -1, name: selectOneLabel }, ...identificationTypesData.adultOrYouth];
        setIdentificationTypes(identificationTypesData?.adultOrYouth);
        setProfile({ ...profile, identificationType: identificationTypesData?.adultOrYouth[0] });
    };
    const validate = () => {
        const errorOfLastName = emptyValidate(profile.lastName, t("errMsg.emptyLastName"));
        lastNameRef?.current.setError(errorOfLastName);
        const errorOfDateOfBirth = emptyValidate(profile.dateOfBirth, t("errMsg.emptyDateOfBirth"));
        dateOfBirthRef?.current.setError(errorOfDateOfBirth);
        const errorIdentificationType = identificationTypeSelectorRef.current.validate();
        return errorOfLastName.error || errorOfDateOfBirth.error || errorIdentificationType.error;
    };
    useImperativeHandle(ref, () => ({
        validate,
    }));
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
                hint={DATE_OF_BIRTH_PLACEHOLDER}
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
                identificationTypeChanged
            />
        </View>
    );
});

export default AdultProfileInfo;
