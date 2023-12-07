import { appConfig } from "../services/AppConfigService";
import { numberOnly } from "../utils/GenUtil";

export default function getAssociatedCustomerMaximum() {
    const { associatedCustomerMaximum } = appConfig.data;
    const isValid =
        associatedCustomerMaximum != null &&
        associatedCustomerMaximum != undefined &&
        numberOnly(associatedCustomerMaximum) &&
        Number.parseInt(associatedCustomerMaximum) > 0;
    return isValid ? Number.parseInt(associatedCustomerMaximum) : 0;
}
