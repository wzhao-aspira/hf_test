import { useState, useEffect } from "react";
import { getFormattedLastUpdateDate } from "../../../utils/DateUtils";
import { KEY_CONSTANT } from "../../../constants/Constants";
import { retrieveItem } from "../../../helper/StorageHelper";

function useLastUpdateDate(showNetInfo: boolean) {
    const [latestUpdateDate, setLatestUpdateDate] = useState(null);

    useEffect(() => {
        console.log({ latestUpdateDateForOfflineBar: latestUpdateDate });
    }, [latestUpdateDate]);

    useEffect(() => {
        async function retrieveLastUpdateDate() {
            const lastUpdateDate = await retrieveItem(KEY_CONSTANT.lastUpdateDate);

            setLatestUpdateDate(lastUpdateDate);
        }

        retrieveLastUpdateDate();
    }, [showNetInfo]);

    return getFormattedLastUpdateDate(latestUpdateDate);
}

export default useLastUpdateDate;
