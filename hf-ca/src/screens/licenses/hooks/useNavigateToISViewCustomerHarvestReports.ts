import useNavigateToIS from "../../../hooks/useNavigateToIS";
import { useAppDispatch } from "../../../hooks/redux";
import { actions as licenseActions } from "../../../redux/LicenseSlice";
import { clearCurrentProfileDetailsUpdateTime } from "../../../helper/AutoRefreshHelper";

function useNavigateToISViewCustomerHarvestReports() {
    const dispatch = useAppDispatch();

    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToViewCustomerHarvestReports: async () => {
            const targetPath = "/LicenseNeedsHarvestReporting";
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

export default useNavigateToISViewCustomerHarvestReports;
