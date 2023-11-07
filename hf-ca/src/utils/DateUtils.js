import moment from "moment";
import { isEmpty, isUndefined } from "lodash";
import AppContract from "../assets/_default/AppContract";
import { LAST_UPDATE_TIME_DISPLAY_FORMAT } from "../constants/Constants";

export default {
    /**
     * get date string which should difference with locate(contract)
     *
     * Format: help check String date is valid
     *
     * @param {MomentInput} input
     * @param {FormatConfig} fmtTo
     * @param {Format} inputFmt
     *
     * @returns String(eg:YYYY/MM/DD) | unValid is "-"
     */
    dateToFormat(input, fmtTo = AppContract.outputFormat.fmt_1, inputFmt = "", strict = false) {
        if (!validFormat(fmtTo)) {
            console.warn("dateToFormat: the fmtTo is outside of AppContract.outputFormat");
            return "-";
        }
        if (!isEmpty(inputFmt) && !validInputFormat(inputFmt)) {
            console.warn("dateToFormat: the inputFmt is outside of AppContract.inputFormat");
            return "-";
        }

        const momentObject = !isEmpty(inputFmt) ? moment(input, inputFmt, strict) : moment(input);
        if (!momentObject.isValid()) {
            return "-";
        }
        return momentObject.format(fmtTo);
    },

    dateObjectToFormat(object, fmt = AppContract.outputFormat.fmt_1) {
        if (isEmpty(object)) {
            console.log(
                "dateObjectToFormat: the input object is unValid, maybe this is a error, please input a object like {year, month, day, hour, minute}"
            );
            return "-";
        }

        const { year, month, day, hour, minute } = object;

        let input = "";
        let inputFmt = AppContract.inputFormat.fmt_2;
        if (year && month && day) {
            input = `${year}-${month}-${day}`;
        }
        // hour、minute may be 0
        if (year && month && day && !isUndefined(hour) && !isUndefined(minute)) {
            input = `${year}-${month}-${day} ${hour}:${minute}`;
            inputFmt = AppContract.inputFormat.fmt_1;
        }
        return this.dateToFormat(input, fmt, inputFmt);
    },
};

/**
 *
 * @param {FormatConfig} fmt
 */
function validFormat(fmt) {
    return !!Object.values(AppContract.outputFormat).find((v) => v === fmt);
}

function validInputFormat(fmt) {
    return !!Object.values(AppContract.inputFormat).find((v) => v === fmt);
}
export function getFormattedLastUpdateDate(date) {
    return date ? moment(date).format(LAST_UPDATE_TIME_DISPLAY_FORMAT) : null;
}
