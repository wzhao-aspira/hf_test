import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonHeader from "../../../components/CommonHeader";
import {
    PROFILE_TYPES,
    IDENTIFICATION_OWNER_YOUTH,
    IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION,
} from "../../../constants/Constants";
import AddProfileInfo from "./AddProfileInfo";
import Routers from "../../../constants/Routers";
import { getMobileAccountByUserId } from "../../../services/ProfileService";
import { selectUsername } from "../../../redux/AppSlice";

const AddProfileScreen = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState({
        profileType: PROFILE_TYPES[0],
        identificationOwner: { id: IDENTIFICATION_OWNER_YOUTH, name: IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION },
    });
    const [mobileAccount, setMobileAccount] = useState();
    const userName = useSelector(selectUsername);
    const getLoginMobileAccount = async () => {
        const mobileAccountData = await getMobileAccountByUserId(userName);
        setMobileAccount(mobileAccountData);
    };
    useEffect(() => {
        getLoginMobileAccount();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("profile.addProfile")} />
            <AddProfileInfo
                mobileAccount={mobileAccount}
                profile={profile}
                setProfile={setProfile}
                profileTypes={PROFILE_TYPES}
                routeScreen={Routers.manageProfile}
            />
        </View>
    );
};

export default AddProfileScreen;
