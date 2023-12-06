import { useState, useEffect } from "react";

import { useAppSelector as useSelector } from "../../../hooks/redux";

import { selectLastUpdateTimeFromServer } from "../../../redux/LicenseSelector";
import drawApplicationSelectors from "../../../redux/DrawApplicationSelector";
import accessPermitSelectors from "../../../redux/AccessPermitSelector";
import preferencePointSelectors from "../../../redux/PreferencePointSelector";

function useLastUpdateDate() {
    const licenseLastUpdateDate = useSelector(selectLastUpdateTimeFromServer);
    const drawApplicationLastUpdateDate = useSelector(drawApplicationSelectors.selectLastUpdateDate);
    const accessPermitLastUpdateDate = useSelector(accessPermitSelectors.selectLastUpdateDate);
    const preferencePointLastUpdateDate = useSelector(preferencePointSelectors.selectLastUpdateDate);

    const [latestUpdateDate, setLatestUpdateDate] = useState(null);

    useEffect(() => {
        console.log({ latestUpdateDate });
    }, [latestUpdateDate]);

    useEffect(() => {
        setLatestUpdateDate(licenseLastUpdateDate);
    }, [licenseLastUpdateDate]);

    useEffect(() => {
        setLatestUpdateDate(drawApplicationLastUpdateDate);
    }, [drawApplicationLastUpdateDate]);

    useEffect(() => {
        setLatestUpdateDate(accessPermitLastUpdateDate);
    }, [accessPermitLastUpdateDate]);

    useEffect(() => {
        setLatestUpdateDate(preferencePointLastUpdateDate);
    }, [preferencePointLastUpdateDate]);

    return latestUpdateDate;
}

export default useLastUpdateDate;
