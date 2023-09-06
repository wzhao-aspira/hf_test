import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryBtn from "../../../components/PrimaryBtn";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import BusinessProfileInfo from "./BusinessProfileInfo";
import VesselProfileInfo from "./VesselProfileInfo";
import { refreshDataAndNavigateWhenSaveProfileCompleted, saveProfile } from "./AddProfileInfo";
import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";

const styles = StyleSheet.create({
    page_container: {
        flexDirection: "column",
        paddingHorizontal: DEFAULT_MARGIN,
        flex: 1,
    },
    contentContainerStyle: {
        paddingTop: 0,
        flexGrow: 1,
    },
});

function AddBusinessVesselProfileInfoScreen({ route }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const safeAreaInsets = useSafeAreaInsets();
    const { params } = route;
    const { mobileAccount, profile: initProfile, routeScreen } = params;
    const { profileType } = initProfile;
    const [profile, setProfile] = useState(initProfile);
    const businessProfileInfoRef = useRef();
    const vesselProfileInfoRef = useRef();
    const onSave = async () => {
        let errorReported = false;
        if (PROFILE_TYPE_IDS.business === profileType.id) {
            errorReported = businessProfileInfoRef.current.validate();
        } else if (PROFILE_TYPE_IDS.vessel === profileType.id) {
            errorReported = vesselProfileInfoRef.current.validate();
        }
        if (errorReported) return;

        const isSaveSuccess = await saveProfile(dispatch, mobileAccount, false, profile, routeScreen);
        if (!isSaveSuccess) {
            return;
        }
        await refreshDataAndNavigateWhenSaveProfileCompleted(dispatch, mobileAccount, false, routeScreen);
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
                        {PROFILE_TYPE_IDS.business === profileType?.id && (
                            <BusinessProfileInfo
                                ref={businessProfileInfoRef}
                                profile={profile}
                                setProfile={setProfile}
                            />
                        )}
                        {PROFILE_TYPE_IDS.vessel === profileType?.id && (
                            <VesselProfileInfo ref={vesselProfileInfoRef} profile={profile} setProfile={setProfile} />
                        )}

                        <PrimaryBtn style={{ marginTop: 40 }} label={t("profile.addProfileProceed")} onPress={onSave} />
                    </View>
                </KeyboardAwareScrollView>
            </Page>
        </View>
    );
}

export default AddBusinessVesselProfileInfoScreen;
