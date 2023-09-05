import React, { useEffect, useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonHeader from "../../../components/CommonHeader";
import AddProfileInfo from "./AddProfileInfo";
import Routers from "../../../constants/Routers";
import { selectUsername } from "../../../redux/AppSlice";
import ProfileThunk from "../../../redux/ProfileThunk";

function AddProfileScreen({ route }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { params } = route;
    const { profileTypes } = params;
    const userName = useSelector(selectUsername);
    const mobileAccount = { userID: userName };
    const profile = { profileType: profileTypes[0] };
    const initProfileCommonData = useCallback(async () => {
        await dispatch(ProfileThunk.initAddProfileCommonData());
    }, [dispatch]);
    useEffect(() => {
        initProfileCommonData();
    }, [initProfileCommonData]);
    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("profile.addProfile")} />
            {profileTypes?.length > 1 && (
                <AddProfileInfo
                    mobileAccount={mobileAccount}
                    profile={profile}
                    profileTypes={profileTypes}
                    routeScreen={Routers.manageProfile}
                />
            )}
        </View>
    );
}

export default AddProfileScreen;
