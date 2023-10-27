import type { RegulationVM } from "../../../../network/generated/api";
import { formatDownloadURL } from "../hooks/useFileOperations";

function getRegulationFileIDList(regulationList: RegulationVM["regulationList"]) {
    if (!regulationList) return null;

    const downloadableFileIDList = regulationList
        .map((item) => item.regulationUrl && formatDownloadURL(item.regulationUrl))
        .filter((item) => !!item);

    return downloadableFileIDList;
}

export default getRegulationFileIDList;
