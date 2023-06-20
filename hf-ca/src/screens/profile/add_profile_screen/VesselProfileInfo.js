import React, { useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { genTestId } from "../../../helper/AppHelper";
import StatefulTextInput from "../../../components/StatefulTextInput";
import AppTheme from "../../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "./ProfileValidate";

const VesselProfileInfo = React.forwardRef(({ profile, setProfile }, ref) => {
    const { t } = useTranslation();
    const goIDNumberRef = useRef();
    const fgNumberRef = useRef();
    const validate = () => {
        const errorOfGOIDNumber = emptyValidate(profile?.goIDNumber, t("errMsg.emptyVesselGOIDNumber"));
        goIDNumberRef?.current.setError(errorOfGOIDNumber);
        const errorOfFGNumber = emptyValidate(profile?.fgNumber, t("errMsg.emptyVesselFGNumber"));
        fgNumberRef?.current.setError(errorOfFGNumber);
        return errorOfGOIDNumber.error || errorOfFGNumber.error;
    };
    useImperativeHandle(ref, () => ({
        validate,
    }));
    return (
        <View>
            <StatefulTextInput
                testID={genTestId("VesselGOIDNumberInput")}
                label={t("profile.vesselGOIDNumber")}
                hint={t("common.pleaseEnter")}
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
                    const error = emptyValidate(profile.goIDNumber, t("errMsg.emptyVesselGOIDNumber"));
                    goIDNumberRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("FGNumberInput")}
                label={t("profile.fgNumber")}
                hint={t("common.pleaseEnter")}
                ref={fgNumberRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(fgNumber) => {
                    setProfile({ ...profile, fgNumber });
                    fgNumberRef.current.setError(emptyError);
                }}
                value={profile.fgNumber}
                onBlur={() => {
                    const error = emptyValidate(profile.fgNumber, t("errMsg.emptyVesselFGNumber"));
                    fgNumberRef?.current.setError(error);
                }}
            />
        </View>
    );
});

export default VesselProfileInfo;
