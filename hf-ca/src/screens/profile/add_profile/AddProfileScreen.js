import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonHeader from "../../../components/CommonHeader";
import AddProfileInfo from "./AddProfileInfo";
import Routers from "../../../constants/Routers";
import { getMobileAccountByUserId, getProfileTypes, getIdentificationTypes } from "../../../services/ProfileService";
import { selectUsername } from "../../../redux/AppSlice";

const AddProfileScreen = () => {
    const { t } = useTranslation();
    const [mobileAccount, setMobileAccount] = useState();
    const [profileTypes, setProfileTypes] = useState([]);
    const [profile, setProfile] = useState({});
    const userName = useSelector(selectUsername);
    const allIdentificationTypes = getIdentificationTypes();
    const getData = async () => {
        const mobileAccountData = await getMobileAccountByUserId(userName);
        setMobileAccount(mobileAccountData);
        const profileTypesData = getProfileTypes(mobileAccountData);
        setProfileTypes(profileTypesData);
        setProfile({
            ...profile,
            profileType: profileTypesData[0],
            identificationType: allIdentificationTypes.adultOrYouth[0],
        });
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("profile.addProfile")} />
            <AddProfileInfo
                mobileAccount={mobileAccount}
                profile={profile}
                setProfile={setProfile}
                profileTypes={profileTypes}
                allIdentificationTypes={allIdentificationTypes}
                routeScreen={Routers.manageProfile}
            />
        </View>
    );
};

export default AddProfileScreen;
