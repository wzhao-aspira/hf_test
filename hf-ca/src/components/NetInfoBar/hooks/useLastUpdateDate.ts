import { useState, useEffect, useCallback } from "react";

import { useAppSelector as useSelector } from "../../../hooks/redux";

import licenseSelectors from "../../../redux/LicenseSelector";
import drawApplicationSelectors from "../../../redux/DrawApplicationSelector";
import accessPermitSelectors from "../../../redux/AccessPermitSelector";
import preferencePointSelectors from "../../../redux/PreferencePointSelector";

import { getFormattedLastUpdateDate } from "../../../utils/DateUtils";

function useLastUpdateDate() {
    const licenseLastUpdateDate = useSelector(licenseSelectors.selectRawLastUpdateTimeDate);
    const drawApplicationLastUpdateDate = useSelector(drawApplicationSelectors.selectRawLastUpdateDate);
    const accessPermitLastUpdateDate = useSelector(accessPermitSelectors.selectRawLastUpdateDate);
    const preferencePointLastUpdateDate = useSelector(preferencePointSelectors.selectRawLastUpdateDate);

    const [latestUpdateDate, setLatestUpdateDate] = useState(null);

    const compareAndUpdateTheDate = useCallback(
        (date: string) => {
            if (!latestUpdateDate || new Date(date) > new Date(latestUpdateDate)) setLatestUpdateDate(date);
        },
        [latestUpdateDate]
    );

    useEffect(() => {
        console.log({ latestUpdateDateForOfflineBar: latestUpdateDate });
    }, [latestUpdateDate]);

    useEffect(() => {
        compareAndUpdateTheDate(licenseLastUpdateDate);
    }, [compareAndUpdateTheDate, licenseLastUpdateDate]);

    useEffect(() => {
        compareAndUpdateTheDate(drawApplicationLastUpdateDate);
    }, [compareAndUpdateTheDate, drawApplicationLastUpdateDate]);

    useEffect(() => {
        compareAndUpdateTheDate(accessPermitLastUpdateDate);
    }, [compareAndUpdateTheDate, accessPermitLastUpdateDate]);

    useEffect(() => {
        compareAndUpdateTheDate(preferencePointLastUpdateDate);
    }, [compareAndUpdateTheDate, preferencePointLastUpdateDate]);

    return getFormattedLastUpdateDate(latestUpdateDate);
}

export default useLastUpdateDate;
