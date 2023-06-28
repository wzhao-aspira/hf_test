import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../components/CommonHeader";
import {
    PROFILE_TYPES_SIGN_UP,
    IDENTIFICATION_OWNER_YOUTH,
    IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION,
} from "../../constants/Constants";
import AddProfileInfo from "../profile/add_profile/AddProfileInfo";

const AddPrimaryProfileScreen = ({ route }) => {
    const { t } = useTranslation();
    const { params } = route;
    const { mobileAccount } = params;
    const [profile, setProfile] = useState({
        isPrimary: true,
        profileType: PROFILE_TYPES_SIGN_UP[0],
        identificationOwner: { id: IDENTIFICATION_OWNER_YOUTH, name: IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION },
    });
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("signUp.addPrimaryProfile")} />
            <AddProfileInfo
                profile={profile}
                setProfile={setProfile}
                mobileAccount={mobileAccount}
                profileTypes={PROFILE_TYPES_SIGN_UP}
            />
        </View>
    );
};

export default AddPrimaryProfileScreen;
