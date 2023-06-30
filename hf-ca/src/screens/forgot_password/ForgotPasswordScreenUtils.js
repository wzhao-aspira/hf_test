import { isEmpty } from "lodash";

export const testIdPrefix = "ForgotPassword";

export const emptyValidate = (input, msg = "required") => {
    return {
        error: isEmpty(input),
        errorMsg: msg,
    };
};

export const headerTitleSubString = (title, from, to) => {
    if (isEmpty(title) || from < 0 || to < 0 || from > to) {
        return title;
    }
    return title.substring(from, to);
};
