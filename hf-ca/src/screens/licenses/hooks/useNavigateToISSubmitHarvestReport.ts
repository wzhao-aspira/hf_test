import useNavigateToIS from "../../../hooks/useNavigateToIS";
import { useAppDispatch } from "../../../hooks/redux";
import { actions as licenseActions } from "../../../redux/LicenseSlice";
import { clearProfileListUpdateTime } from "../../../helper/AutoRefreshHelper";

function useNavigateToISSubmitHarvestReport(licenseId: string) {
    const dispatch = useAppDispatch();

    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToIS: async () => {
            const targetPath = `/LicenseNeedsHarvestReporting/EnterHarvestMobile?id=${licenseId}`;
            const result = await navigateToIS({
                targetPath,
            });

            if (result) {
                // clear license update time
                dispatch(licenseActions.clearUpdateTime());
                // clear profile list update time
                clearProfileListUpdateTime();
            }
        },
    };
}

export default useNavigateToISSubmitHarvestReport;
