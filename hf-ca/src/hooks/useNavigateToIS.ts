import { useCallback } from "react";

import { useDispatch } from "react-redux";
import Routers, { useAppNavigation } from "../constants/Routers";

import { useAppSelector } from "./redux";

import { appConfig } from "../services/AppConfigService";
import { retrieveAccessToken } from "../network/tokenUtil";

import { selectors as profileSelectors } from "../redux/ProfileSlice";
import { handleError } from "../network/APIUtil";
import Miscellaneous from "../network/api_client/Miscellaneous";
import { getISWebStaticInfo } from "../helper/AppHelper";

function useNavigateToIS() {
    const dispatch = useDispatch();
    const currentInUseProfileID = useAppSelector(profileSelectors.selectCurrentInUseProfileID);
    const navigation = useAppNavigation();

    const navigateToIS = useCallback(
        async ({ targetPath }: { targetPath: string }) => {
            const checkTokenResponse = await handleError(Miscellaneous.checkTokenAPI(), {
                dispatch,
                showLoading: true,
            });

            if (!checkTokenResponse.success) {
                return false;
            }

            const internetSalesBaseURL = appConfig.data?.internetSalesBaseURL;
            const accessToken = retrieveAccessToken();
            const focusCustomerID = currentInUseProfileID;
            const webStaticInfo = getISWebStaticInfo();

            const ISPurchaseLicenseURL = `${internetSalesBaseURL}CustomerSearch/AutoLoginForMobile?token=${accessToken}&focusCustomerID=${focusCustomerID}&targetPath=${encodeURIComponent(
                targetPath
            )}&${webStaticInfo}`;

            console.log({ ISPurchaseLicenseURL });

            navigation.navigate(Routers.webView, {
                url: ISPurchaseLicenseURL,
            });

            return true;
        },
        [currentInUseProfileID, dispatch, navigation]
    );

    return { navigateToIS };
}

export default useNavigateToIS;
