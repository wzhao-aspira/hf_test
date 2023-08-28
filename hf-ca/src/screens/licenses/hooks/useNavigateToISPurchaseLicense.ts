import { useAppDispatch } from "../../../hooks/redux";
import useNavigateToIS from "../../../hooks/useNavigateToIS";

import { actions as licenseActions } from "../../../redux/LicenseSlice";

function useNavigateToISPurchaseLicense() {
    const dispatch = useAppDispatch();
    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToIS: () => {
            dispatch(licenseActions.clearUpdateTime());
            navigateToIS({
                targetPath: "/Sales/ItemSelection",
            });
        },
    };
}

export default useNavigateToISPurchaseLicense;
