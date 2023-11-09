import { useSelector } from "react-redux";
import useNavigateToIS from "../../../hooks/useNavigateToIS";
import { useAppDispatch } from "../../../hooks/redux";
import { actions as licenseActions } from "../../../redux/LicenseSlice";
import { clearCurrentProfileDetailsUpdateTime } from "../../../helper/AutoRefreshHelper";
import { selectors } from "../../../redux/ProfileSlice";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import DialogHelper from "../../../helper/DialogHelper";

function useNavigateToISSubmitHarvestReport(licenseId: string) {
    const dispatch = useAppDispatch();

    const { navigateToIS } = useNavigateToIS();
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(currentInUseProfileId));
    const { profileType } = profileDetails;
    return {
        navigateToSubmitHarvestReport: async () => {
            if (PROFILE_TYPE_IDS.business == profileType) {
                DialogHelper.showSimpleDialog({
                    title: "common.reminder",
                    message: "licenseDetails.unableToProcessReport",
                    okText: "common.gotIt",
                });
                return;
            }
            const targetPath = `/LicenseNeedsHarvestReporting/EnterHarvestMobile?id=${licenseId}`;

            const result = await navigateToIS({
                targetPath,
            });

            if (result) {
                // clear license update time
                dispatch(licenseActions.clearUpdateTime());
                // clear current profile update time
                clearCurrentProfileDetailsUpdateTime();
            }
        },
    };
}

export default useNavigateToISSubmitHarvestReport;
