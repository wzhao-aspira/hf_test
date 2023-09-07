import { useCallback } from "react";

import Routers, { useAppNavigation } from "../constants/Routers";

import { useAppSelector } from "./redux";

import { getInternetSalesURL } from "../helper/AppHelper";
import { retrieveAccessToken } from "../network/tokenUtil";

import { selectors as profileSelectors } from "../redux/ProfileSlice";

function useNavigateToIS() {
    const currentInUseProfileID = useAppSelector(profileSelectors.selectCurrentInUseProfileID);
    const navigation = useAppNavigation();

    const navigateToIS = useCallback(
        ({ targetPath }: { targetPath: string }) => {
            const internetSalesBaseURL = getInternetSalesURL();
            const accessToken = retrieveAccessToken();
            const focusCustomerID = currentInUseProfileID;

            const ISPurchaseLicenseURL = `${internetSalesBaseURL}CustomerSearch/AutoLoginForMobile?token=${accessToken}&focusCustomerID=${focusCustomerID}&targetPath=${encodeURIComponent(
                targetPath
            )}`;

            console.log({ ISPurchaseLicenseURL });

            navigation.navigate(Routers.webView, {
                url: ISPurchaseLicenseURL,
            });
        },
        [currentInUseProfileID, navigation]
    );

    return { navigateToIS };
}

export default useNavigateToIS;
