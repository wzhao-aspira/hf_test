import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { genTestId } from "../../../helper/AppHelper";
import PopupDropdown from "../../../components/PopupDropdown";
import Page from "../../../components/Page";
import PrimaryBtn from "../../../components/PrimaryBtn";
import CommonHeader from "../../../components/CommonHeader";
import AppTheme from "../../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { saveProfile } from "../../../services/ProfileService";
import {
    PROFILE_TYPE_IDS,
    PROFILE_TYPES,
    IDENTIFICATION_OWNER_YOUTH,
    IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION,
} from "../../../constants/Constants";
import AdultProfileInfo from "./AdultProfileInfo";
import YouthProfileInfo from "./YouthProfileInfo";
import BusinessProfileInfo from "./BusinessProfileInfo";
import VesselProfileInfo from "./VesselProfileInfo";
import Routers from "../../../constants/Routers";
import NavigationService from "../../../navigation/NavigationService";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: 40,
        flex: 1,
    },
    contentContainerStyle: {
        paddingTop: 0,
        flexGrow: 1,
    },
});

const AddProfileScreen = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState({
        profileType: PROFILE_TYPES[0],
        identificationOwner: { id: IDENTIFICATION_OWNER_YOUTH, name: IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION },
    });

    const safeAreaInsets = useSafeAreaInsets();

    const profileTypeNames = PROFILE_TYPES.map((pt) => pt.name);
    const { profileType } = profile;

    const [identificationOwnerChanged, setIdentificationOwnerChanged] = useState(true);

    const changeProfileType = (index) => {
        const selectedProfileType = PROFILE_TYPES[index];
        setProfile({ ...profile, profileType: selectedProfileType });
        setIdentificationOwnerChanged(false);
        setTimeout(() => setIdentificationOwnerChanged(true), 0);
    };
    const adultProfileInfoRef = useRef();
    const youthProfileInfoRef = useRef();
    const businessProfileInfoRef = useRef();
    const vesselProfileInfoRef = useRef();

    const onSave = () => {
        let errorReported = false;
        if (PROFILE_TYPE_IDS.adult === profileType.id) {
            errorReported = adultProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.youth === profileType.id) {
            errorReported = youthProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.business === profileType.id) {
            errorReported = businessProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.vessel === profileType.id) {
            errorReported = vesselProfileInfoRef.current.validate();
        }
        if (errorReported) return;
        saveProfile(profile);
        NavigationService.navigate(Routers.manageProfile);
    };

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={t("profile.addProfile")} />
            <Page>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        ...styles.contentContainerStyle,
                        paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM,
                    }}
                >
                    <View style={styles.page_container}>
                        <PopupDropdown
                            testID={genTestId("YouAreDropdown")}
                            label={t("profile.youAre")}
                            containerStyle={{ marginTop: 20 }}
                            valueContainerStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                            labelStyle={{ color: AppTheme.colors.font_color_1 }}
                            options={profileTypeNames}
                            defaultValue={profileType.name}
                            onSelect={(index) => changeProfileType(index)}
                        />
                        {PROFILE_TYPE_IDS.adult === profileType.id && (
                            <AdultProfileInfo ref={adultProfileInfoRef} profile={profile} setProfile={setProfile} />
                        )}
                        {PROFILE_TYPE_IDS.youth === profileType.id && (
                            <YouthProfileInfo
                                ref={youthProfileInfoRef}
                                profile={profile}
                                setProfile={setProfile}
                                identificationOwnerChanged={identificationOwnerChanged}
                            />
                        )}
                        {PROFILE_TYPE_IDS.business === profileType.id && (
                            <BusinessProfileInfo
                                ref={businessProfileInfoRef}
                                profile={profile}
                                setProfile={setProfile}
                            />
                        )}
                        {PROFILE_TYPE_IDS.vessel === profileType.id && (
                            <VesselProfileInfo ref={vesselProfileInfoRef} profile={profile} setProfile={setProfile} />
                        )}

                        <PrimaryBtn style={{ marginTop: 40 }} label={t("profile.addProfileProceed")} onPress={onSave} />
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
};

export default AddProfileScreen;
