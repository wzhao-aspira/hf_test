import React, { useState } from "react";
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
import { PROFILE_TYPE_IDS, PROFILE_TYPES } from "../../../constants/Constants";
import AdultScreen from "./AdultScreen";
import YouthScreen from "./YouthScreen";
import BusinessScreen from "./BusinessScreen";
import VesselScreen from "./VesselScreen";

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

function AddProfileScreen() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState({});

    const safeAreaInsets = useSafeAreaInsets();

    const profileTypeNames = PROFILE_TYPES.map((pt) => pt.name);
    const [profileType, setProfileType] = useState(profile.profileType || PROFILE_TYPES[0]);

    const changeProfileType = (index) => {
        const selectedProfileType = PROFILE_TYPES[index];
        setProfileType(selectedProfileType);
        setProfile({ ...profile, profileType });
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
                            <AdultScreen profile={profile} setProfile={setProfile} />
                        )}
                        {PROFILE_TYPE_IDS.youth === profileType.id && (
                            <YouthScreen profile={profile} setProfile={setProfile} />
                        )}
                        {PROFILE_TYPE_IDS.business === profileType.id && (
                            <BusinessScreen profile={profile} setProfile={setProfile} />
                        )}
                        {PROFILE_TYPE_IDS.vessel === profileType.id && (
                            <VesselScreen profile={profile} setProfile={setProfile} />
                        )}

                        <PrimaryBtn
                            style={{ marginTop: 40 }}
                            label={t("profile.addProfileProceed")}
                            onPress={() => {
                                saveProfile(profile);
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
}

export default AddProfileScreen;
