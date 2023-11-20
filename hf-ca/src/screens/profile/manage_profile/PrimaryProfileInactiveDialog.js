import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";

import { Dialog } from "../../../components/Dialog";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import { actions, selectors as appSelectors, selectIsPrimaryProfileInactive } from "../../../redux/AppSlice";
import { genTestId } from "../../../helper/AppHelper";
import { useDialog } from "../../../components/dialog/index";
import PrimaryBtn from "../../../components/PrimaryBtn";
import SwitchProfileDialog from "./SwitchProfileDialog";
import { primaryProfileInactiveStyles } from "./Styles";
import { goToAddNewPrimaryProfilePage } from "../../../services/ProfileService";
import Routers from "../../../constants/Routers";

function PrimaryProfileInactiveDialog() {
    const dispatch = useDispatch();

    const associatedProfiles = useSelector(profileSelectors.selectAssociatedProfiles);
    const individualProfiles = useSelector(profileSelectors.selectIndividualProfiles);
    const userID = useSelector(appSelectors.selectUsername);
    const showDialog = useSelector(selectIsPrimaryProfileInactive);
    const { openCustomDialog, closeDialog } = useDialog();
    const hasAssociatedProfile = associatedProfiles.length > 0;
    const hasIndividualProfile = individualProfiles.length > 0;
    const currentRoute = Routers.current;

    const handleProceed = () => {
        dispatch(actions.toggleShowPrimaryProfileInactiveMsg(false));
        dispatch(actions.togglePrimaryInactivatedWhenSignIn(false));

        if (hasIndividualProfile) {
            openCustomDialog({
                renderContent: () => (
                    <SwitchProfileDialog hideDialog={closeDialog} isSwitchToPrimary currentRoute={currentRoute} />
                ),
            });
        } else {
            goToAddNewPrimaryProfilePage(userID, currentRoute);
        }
    };

    return (
        <Dialog visible={showDialog}>
            <View style={primaryProfileInactiveStyles.container}>
                <Text testID={genTestId("reminder")} style={primaryProfileInactiveStyles.title}>
                    {t("common.reminder")}
                </Text>

                <Text testID={genTestId("noAvailablePrimary")} style={primaryProfileInactiveStyles.message}>
                    {t("profile.noAvailablePrimary")}
                </Text>
                {hasAssociatedProfile && (
                    <View>
                        <Text
                            testID={genTestId("associatedRemovedAsWell")}
                            style={primaryProfileInactiveStyles.message}
                        >
                            {t("profile.associatedRemovedAsWell")}
                        </Text>

                        <Text
                            testID={genTestId("associatedProfiles")}
                            style={{ ...primaryProfileInactiveStyles.message, marginTop: 20 }}
                        >
                            {t("profile.associatedProfiles")}
                        </Text>
                        {associatedProfiles.map((profile) => (
                            <Text
                                key={profile.profileId}
                                testID={genTestId(`${profile.profileId}profile`)}
                                style={primaryProfileInactiveStyles.message}
                            >
                                {profile.displayName} - {profile.goIDNumber}
                            </Text>
                        ))}
                    </View>
                )}

                <PrimaryBtn
                    onPress={handleProceed}
                    label={t("common.proceed")}
                    style={primaryProfileInactiveStyles.okBtn}
                    testID={genTestId("proceedBtn")}
                />
            </View>
        </Dialog>
    );
}

export default PrimaryProfileInactiveDialog;
