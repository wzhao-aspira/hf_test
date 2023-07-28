import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonHeader from "../../../components/CommonHeader";
import AddProfileInfo from "./AddProfileInfo";
import Routers from "../../../constants/Routers";
import { getProfileTypes } from "../../../services/ProfileService";
import { selectUsername } from "../../../redux/AppSlice";
import profileSelectors from "../../../redux/ProfileSelector";
import ProfileThunk from "../../../redux/ProfileThunk";
import { handleError } from "../../../network/APIUtil";

function AddProfileScreen() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [mobileAccount, setMobileAccount] = useState();
    const [profileTypes, setProfileTypes] = useState([]);
    const [profile, setProfile] = useState({});
    const userName = useSelector(selectUsername);
    const selectOne = { id: -1, name: t("profile.selectOne") };
    const allIdentificationTypes = useSelector(profileSelectors.selectIdentityTypes(selectOne));
    const initAndRefreshProfileTypes = useCallback(async () => {
        setMobileAccount({ userID: userName });
        const ret = await handleError(getProfileTypes(), { dispatch, showLoading: true });
        if (ret.success) {
            const profileTypesData = ret.data;
            setProfileTypes(profileTypesData);
            setProfile({
                ...profile,
                profileType: profileTypesData[0],
                identificationType: allIdentificationTypes?.adultOrYouth[0],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        dispatch(ProfileThunk.initAddProfileCommonData());
        initAndRefreshProfileTypes();
    }, [dispatch, initAndRefreshProfileTypes]);
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
}

export default AddProfileScreen;
