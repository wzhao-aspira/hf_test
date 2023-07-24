import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../components/CommonHeader";
import AddProfileInfo from "../profile/add_profile/AddProfileInfo";
import { getIdentificationTypes, getIndividualProfileTypes } from "../../services/ProfileService";

function AddPrimaryProfileScreen({ route }) {
    const { t } = useTranslation();
    const { params } = route;
    const { mobileAccount } = params;
    const individualProfileTypes = getIndividualProfileTypes();
    const allIdentificationTypes = getIdentificationTypes();
    const [profile, setProfile] = useState({
        isPrimary: true,
        profileType: individualProfileTypes[0],
        identificationType: allIdentificationTypes.adultOrYouth[0],
    });
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("signUp.addPrimaryProfile")} />
            <AddProfileInfo
                profile={profile}
                setProfile={setProfile}
                mobileAccount={mobileAccount}
                profileTypes={individualProfileTypes}
                allIdentificationTypes={allIdentificationTypes}
                isAddPrimaryProfile
            />
        </View>
    );
}

export default AddPrimaryProfileScreen;
