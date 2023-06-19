import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import PopupDropdown from "../../../components/PopupDropdown";
import StatefulTextInput from "../../../components/StatefulTextInput";
import AppTheme from "../../../assets/_default/AppTheme";
import { getCountriesStates } from "../../../services/ProfileService";

function IdentifierTypeSelector({ identificationTypes, identificationType, handleIdentificationType }) {
    const { t } = useTranslation();
    const idTypeNames = identificationTypes ? identificationTypes.map((idType) => idType.name) : [];

    const findIdentificationConfig = (idType) => {
        const { config } = identificationTypes?.find((type) => idType && type.id === idType.id) || {};
        return config || {};
    };
    const initIdentificationConfig = findIdentificationConfig(identificationType);
    const [currentIdentificationConfig, setCurrentIdentificationConfig] = useState(initIdentificationConfig);

    const changeIdentificationType = (index) => {
        const selectedIdentificationType = identificationTypes[index];
        handleIdentificationType(selectedIdentificationType);
        const identificationConfig = findIdentificationConfig(selectedIdentificationType);
        setCurrentIdentificationConfig(identificationConfig);
    };
    const { identificationInfo } = identificationType || {};

    const [countriesStates, setCountriesStates] = useState();

    const { countries, states } = countriesStates || {};

    const issuedCountriesNames = countries ? countries.map((country) => country.name) : [];
    const issuedStatesNames = states ? states.map((state) => state.name) : [];

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
    useEffect(() => {
        getCountriesStatesData();
    }, []);
    return (
        <View>
            <PopupDropdown
                testID={genTestId("IdentificationTypeDropdown")}
                label={t("profile.identificationType")}
                containerStyle={{ marginTop: 20 }}
                valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                options={idTypeNames}
                defaultValue={identificationType?.name}
                onSelect={(index) => changeIdentificationType(index)}
            />
            {currentIdentificationConfig.issuedCountryRequired && (
                <PopupDropdown
                    testID={genTestId("CountryIssuedDropdown")}
                    label={t("profile.countryIssued")}
                    containerStyle={{ marginTop: 20 }}
                    valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    options={issuedCountriesNames}
                    defaultValue={identificationInfo?.countryIssued?.name}
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
                    options={issuedStatesNames}
                    defaultValue={identificationInfo?.stateIssued?.name}
                    onSelect={(index) => changeStateIssued(index)}
                />
            )}
            {currentIdentificationConfig.idNumberRequired && (
                <StatefulTextInput
                    testID={genTestId("IdentificationNumberDropdown")}
                    label={t("profile.identificationNumber")}
                    style={{ marginTop: 20 }}
                    labelStyle={{ color: AppTheme.colors.font_color_1 }}
                    inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                    onChangeText={(text) => {
                        // this.setState({ identifierNum: text });
                        // const error = {
                        //     error: false,
                        //     errorMsg: null,
                        // };
                        // this.identifierNumRef?.current.setError(error);
                        changeIdNumber(text);
                    }}
                    value={identificationInfo?.idNumber}
                    onBlur={() => {}}
                />
            )}
        </View>
    );
}

export default IdentifierTypeSelector;
