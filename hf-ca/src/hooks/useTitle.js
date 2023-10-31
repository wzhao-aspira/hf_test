import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import profileSelectors from "../redux/ProfileSelector";

function useTitle(withNameKey, withOutNameKey) {
    const { t } = useTranslation();
    const firstName = useSelector(profileSelectors.selectCurrentProfileFirstName);
    const withoutNameTitle = t(withOutNameKey);
    const withNameTitle = t(withNameKey, { firstName });
    const title = firstName ? withNameTitle : withoutNameTitle;
    return title;
}

export default useTitle;
