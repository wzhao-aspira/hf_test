import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonHeader from "../../components/CommonHeader";
import AddProfileInfo from "../profile/add_profile/AddProfileInfo";
import profileSelectors from "../../redux/ProfileSelector";
import ProfileThunk from "../../redux/ProfileThunk";
import { getIndividualProfileTypes } from "../../services/ProfileService";

function AddPrimaryProfileScreen({ route }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { params } = route;
    const { mobileAccount, noBackBtn = true } = params;
    const individualProfileTypes = getIndividualProfileTypes();
    const selectOne = { id: -1, name: t("profile.selectOne") };
    const allIdentificationTypes = useSelector(profileSelectors.selectIdentityTypes(selectOne));
    const [profile, setProfile] = useState({
        isPrimary: true,
        profileType: individualProfileTypes[0],
        identificationType: allIdentificationTypes?.adultOrYouth[0],
    });
    useEffect(() => {
        dispatch(ProfileThunk.initAddProfileCommonData());
    }, [dispatch]);
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("signUp.addPrimaryProfile")} showLeft={!noBackBtn} />
            <AddProfileInfo
                profile={profile}
                setProfile={setProfile}
                mobileAccount={mobileAccount}
                profileTypes={individualProfileTypes}
                allIdentificationTypes={allIdentificationTypes}
                isAddPrimaryProfile
                noBackBtn={noBackBtn}
            />
        </View>
    );
}

export default AddPrimaryProfileScreen;
