import { isEmpty } from "lodash";
import moment from "moment";

export const emptyValidate = (input, msg = "required") => {
    return {
        error: isEmpty(input),
        errorMsg: msg,
    };
};
export const emptyError = {
    error: false,
    errorMsg: null,
};

export function validateDateOfBirth(dateValue, dateFormat, t) {
    const dateOfBirthRequiredMsg = t("errMsg.dateOfBirthRequired");
    const dateOfBirthInvalidMsg = t("errMsg.dateOfBirthInvalid");
    const dateOfBirthMustBePastMsg = t("errMsg.dateOfBirthMustBePast");
    let errorMsg = "";
    if (isEmpty(dateValue)) {
        errorMsg = dateOfBirthRequiredMsg;
    } else {
        const dateOfBirth = moment(dateValue, dateFormat, true);
        if (!dateOfBirth?.isValid()) {
            errorMsg = dateOfBirthInvalidMsg;
        } else if (dateOfBirth > new Date()) {
            errorMsg = dateOfBirthMustBePastMsg;
        }
    }
    return errorMsg;
}
