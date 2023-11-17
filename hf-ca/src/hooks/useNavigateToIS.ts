import { useCallback } from "react";

import { t } from "i18next";

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

    const getAdditionalInfoQueryString = useCallback(
        (
            {
                openInBrowser,
                customerID,
            }: {
                openInBrowser?: boolean;
                customerID?: string;
            } = {
                openInBrowser: false,
            }
        ) => {
            const focusCustomerID = customerID || currentInUseProfileID;
            const accessToken = retrieveAccessToken();
            const webStaticInfo = getISWebStaticInfo(openInBrowser);

            return `&token=${accessToken}&focusCustomerID=${focusCustomerID}&${webStaticInfo}`;
        },
        [currentInUseProfileID]
    );

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
            const additionalInfoQueryString = getAdditionalInfoQueryString();

            const ISURLWithAdditionalInfo = `${internetSalesBaseURL}CustomerSearch/AutoLoginForMobile?targetPath=${encodeURIComponent(
                targetPath
            )}${additionalInfoQueryString}`;

            console.log({ ISURLWithAdditionalInfo });

            navigation.navigate(Routers.webView, {
                url: ISURLWithAdditionalInfo,
                title: t("webview.CDFWSalesAndServices"),
            });

            return true;
        },
        [dispatch, getAdditionalInfoQueryString, navigation]
    );

    return { navigateToIS, getAdditionalInfoQueryString };
}

export default useNavigateToIS;
