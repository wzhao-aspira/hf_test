import { useAppDispatch } from "../../../hooks/redux";
import useNavigateToIS from "../../../hooks/useNavigateToIS";
import { actions as licenseActions } from "../../../redux/LicenseSlice";

function useNavigateToISViewHarvestReport(harvestReportId: string) {
    const dispatch = useAppDispatch();

    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToViewHarvestReport: async () => {
            const targetPath = `/LicenseNeedsHarvestReporting/ViewHarvestMobile/${harvestReportId}`;

            const result = await navigateToIS({
                targetPath,
            });

            if (result) {
                // clear license update time
                dispatch(licenseActions.clearUpdateTime());
            }
        },
    };
}

export default useNavigateToISViewHarvestReport;
