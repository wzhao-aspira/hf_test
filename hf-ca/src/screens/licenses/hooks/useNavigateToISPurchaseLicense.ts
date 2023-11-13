import useNavigateToIS from "../../../hooks/useNavigateToIS";
import { useAppDispatch } from "../../../hooks/redux";
import { actions as licenseActions } from "../../../redux/LicenseSlice";
import { clearCurrentProfileDetailsUpdateTime } from "../../../helper/AutoRefreshHelper";

function useNavigateToISPurchaseLicense() {
    const dispatch = useAppDispatch();

    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToIS: async () => {
            const result = await navigateToIS({
                targetPath: "/Sales/ItemSelection",
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

export default useNavigateToISPurchaseLicense;
