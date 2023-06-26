import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import PopupDropdown from "../../../components/PopupDropdown";
import StatefulTextInput from "../../../components/StatefulTextInput";
import AppTheme from "../../../assets/_default/AppTheme";
import { getCountriesStates } from "../../../services/ProfileService";
import { emptyError, emptyValidate } from "./ProfileValidate";
import { IDENTIFICATION_TYPE_GO_ID } from "../../../constants/Constants";

const IdentificationTypeSelector = React.forwardRef(
    ({ identificationTypes, identificationType, handleIdentificationType }, ref) => {
        const { t } = useTranslation();
        const idNumberLabel =
            identificationType?.id === IDENTIFICATION_TYPE_GO_ID
                ? t("profile.identificationTypeGOID")
                : t("profile.identificationNumber");
        const identificationTypeRef = useRef();
        const idNumberRef = useRef();

        const findIdentificationConfig = (idType) => {
            const { config } = identificationTypes?.find((type) => idType && type.id === idType.id) || {};
            return config || {};
        };
        const initIdentificationConfig = findIdentificationConfig(identificationType);
        const [currentIdentificationConfig, setCurrentIdentificationConfig] = useState(initIdentificationConfig);

        const { identificationInfo } = identificationType || {};

        const [countriesStates, setCountriesStates] = useState();

        const { countries, states } = countriesStates || {};

        const changeCountryIssued = (index) => {
            const selectedCountryIssued = countries[index];
            handleIdentificationType({
                ...identificationType,
                identificationInfo: { ...identificationInfo, countryIssued: { ...selectedCountryIssued } },
            });
        };
        const changeStateIssued = (index) => {
            const selectedStateIssued = states[index];
            handleIdentificationType({
                ...identificationType,
                identificationInfo: { ...identificationInfo, stateIssued: { ...selectedStateIssued } },
            });
        };
        const changeIdNumber = (idNumber) => {
            handleIdentificationType({
                ...identificationType,
                identificationInfo: { ...identificationInfo, idNumber },
            });
        };

        const getCountriesStatesData = async () => {
            const countriesStatesData = await getCountriesStates();
            setCountriesStates(countriesStatesData);
        };
        const idNumberError =
            identificationType?.id === IDENTIFICATION_TYPE_GO_ID
                ? t("errMsg.emptyIdentificationGOID")
                : t("errMsg.emptyIdentificationNumber");
        const validate = () => {
            const errorOfIdentificationType =
                identificationType && identificationType.id && identificationType.id !== "-1"
                    ? { error: false }
                    : { error: true, errorMsg: t("errMsg.emptyIdentificationType") };
            identificationTypeRef?.current?.setError(errorOfIdentificationType);

            const errorOfIDNumber = emptyValidate(identificationInfo?.idNumber, idNumberError);
            idNumberRef?.current?.setError(errorOfIDNumber);

            return errorOfIDNumber.error;
        };
        const changeIdentificationType = (index) => {
            const selectedIdentificationType = identificationTypes[index];
            handleIdentificationType(selectedIdentificationType);
            const identificationConfig = findIdentificationConfig(selectedIdentificationType);
            setCurrentIdentificationConfig(identificationConfig);
            identificationTypeRef?.current?.setError(emptyError);
            idNumberRef?.current?.setError(emptyError);
        };

        const isShowAssociateItem = identificationType && identificationType.id != -1;
        useImperativeHandle(ref, () => ({
            validate,
        }));
        useEffect(() => {
            getCountriesStatesData();
        }, []);
        return (
            <View>
                <PopupDropdown
                    ref={identificationTypeRef}
                    testID={genTestId("IdentificationTypeDropdown")}
                    label={t("profile.identificationType")}
                    containerStyle={{ marginTop: 20 }}
                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    options={identificationTypes}
                    value={identificationType?.name}
                    onSelect={(index) => changeIdentificationType(index)}
                />
                {isShowAssociateItem && (
                    <>
                        {currentIdentificationConfig.issuedCountryRequired && (
                            <PopupDropdown
                                testID={genTestId("CountryIssuedDropdown")}
                                label={t("profile.countryIssued")}
                                containerStyle={{ marginTop: 20 }}
                                valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                                options={countries}
                                value={identificationInfo?.countryIssued?.name}
                                onSelect={(index) => changeCountryIssued(index)}
                            />
                        )}
                        {currentIdentificationConfig.issuedStateRequired && (
                            <PopupDropdown
                                testID={genTestId("StateIssuedDropdown")}
                                label={t("profile.stateIssued")}
                                containerStyle={{ marginTop: 20 }}
                                valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                                options={states}
                                value={identificationInfo?.stateIssued?.name}
                                onSelect={(index) => changeStateIssued(index)}
                            />
                        )}
                        {currentIdentificationConfig.idNumberRequired && (
                            <StatefulTextInput
                                testID={genTestId("IdentificationNumberDropdown")}
                                label={idNumberLabel}
                                ref={idNumberRef}
                                hint={t("common.pleaseEnter")}
                                style={{ marginTop: 20 }}
                                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                                onChangeText={(text) => {
                                    changeIdNumber(text);
                                    idNumberRef.current.setError(emptyError);
                                }}
                                value={identificationInfo?.idNumber}
                                onBlur={() => {
                                    const error = emptyValidate(identificationInfo?.idNumber, idNumberError);
                                    idNumberRef.current.setError(error);
                                }}
                            />
                        )}
                    </>
                )}
            </View>
        );
    }
);

export default IdentificationTypeSelector;
