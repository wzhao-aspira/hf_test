import { isEmpty } from "lodash";

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
