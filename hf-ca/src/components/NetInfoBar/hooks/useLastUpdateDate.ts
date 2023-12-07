import { useState, useEffect } from "react";
import { getFormattedLastUpdateDate } from "../../../utils/DateUtils";
import { KEY_CONSTANT } from "../../../constants/Constants";
import { retrieveItem } from "../../../helper/StorageHelper";
import { useAppSelector as useSelector } from "../../../hooks/redux";
import profileSelectors from "../../../redux/ProfileSelector";

function useLastUpdateDate(showNetInfo: boolean) {
    const currentInUseProfileID = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const [latestUpdateDate, setLatestUpdateDate] = useState(null);

    useEffect(() => {
        console.log({ latestUpdateDateForOfflineBar: latestUpdateDate });
    }, [latestUpdateDate]);

    useEffect(() => {
        async function retrieveLastUpdateDate() {
            const lastUpdateDateOfCustomers = await retrieveItem(KEY_CONSTANT.lastUpdateDateOfCustomers);
            const parsedLastUpdateDateOfCustomers = JSON.parse(lastUpdateDateOfCustomers);

            const lastUpdateDate = parsedLastUpdateDateOfCustomers[currentInUseProfileID];

            setLatestUpdateDate(lastUpdateDate);
        }

        retrieveLastUpdateDate();
    }, [currentInUseProfileID, showNetInfo]);

    return getFormattedLastUpdateDate(latestUpdateDate);
}

export default useLastUpdateDate;
