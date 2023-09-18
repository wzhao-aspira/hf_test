import { AccessPermitItem, AccessPermit, HuntDay, FileInfo } from "../types/accessPermit";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import { getActivePermitsByCustomerId } from "../network/api_client/DrawResultsApi";

const formateHuntDay = (huntDay, outputFormat) => {
    return huntDay && DateUtils.dateToFormat(huntDay, outputFormat, AppContract.inputFormat.fmt_2);
};

const convertAccessPermitItem = (activePermit): AccessPermitItem => {
    const { applicationYear, masterHuntTypeName, masterHuntTypeId, huntDays } = activePermit;
    const id = applicationYear + masterHuntTypeId;
    const name = `${applicationYear} ${masterHuntTypeName}`;
    const activePermitHuntDays = huntDays
        .map((item) => {
            const {
                huntCode,
                huntName,
                huntDay,
                drawnSequence,
                notificationTitle,
                notificationDescription,
                drawTicketLicenseId,
                notificationAvailable,
                fileTitle,
                fileId,
            } = item;
            const huntId = huntDay + huntCode;

            const f1Info: FileInfo = {
                type: "File1",
                title: notificationTitle,
                description: notificationDescription,
                downloadId: drawTicketLicenseId,
                isShow: notificationAvailable,
            };
            const f2Info: FileInfo = {
                type: "File2",
                title: fileTitle,
                downloadId: fileId,
                isShow: !!fileId,
            };

            const fileInfoList = [f1Info, f2Info];

            return {
                id: huntId,
                huntCode,
                huntName,
                huntDayForSort: huntDay,
                huntDay: formateHuntDay(huntDay, AppContract.outputFormat.fmt_1),
                huntDayForDetail: formateHuntDay(huntDay, AppContract.outputFormat.fmt_2),
                drawnSequence,
                fileInfoList,
            };
        })
        .sort((a, b) => b.huntDayForSort.localeCompare(a.huntDayForSort) && a.huntName.localeCompare(b.huntName));

    return { id, name, huntDays: activePermitHuntDays };
};

const convertCustomerInfo = (customerInfo) => {
    const { firstName, lastName, goId, mailingAddress } = customerInfo;
    return { name: `${firstName}, ${lastName}`, address: mailingAddress, goId };
};

export const sortHuntDays = (huntDays: HuntDay[], ascendingOrder: boolean) => {
    if (ascendingOrder) {
        huntDays.sort((a, b) => {
            if (a.huntDayForSort != b.huntDayForSort) {
                return a.huntDayForSort.localeCompare(b.huntDayForSort);
            }
            return a.huntName.localeCompare(b.huntName);
        });
    } else {
        huntDays.sort((a, b) => {
            if (a.huntDayForSort != b.huntDayForSort) {
                return b.huntDayForSort.localeCompare(a.huntDayForSort);
            }
            return a.huntName.localeCompare(b.huntName);
        });
    }
    return huntDays;
};

export async function getAccessPermitData(searchParams: { activeProfileId: string }): Promise<AccessPermit> {
    const { activeProfileId } = searchParams;
    const getActivePermitsResult = await getActivePermitsByCustomerId(activeProfileId);
    const { result } = getActivePermitsResult.data;
    const { instructions, activePermitList, customerInfo } = result;
    const accessPermits = activePermitList
        .map((item) => {
            return convertAccessPermitItem(item);
        })
        .sort((a, b) => b.name.localeCompare(a.name));
    const customer = convertCustomerInfo(customerInfo);
    const data = { attention: instructions, accessPermits, customer };
    return data;
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
