import React from "react";
import { genTestId } from "../../helper/AppHelper";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";
import PrimaryBtn from "../../components/PrimaryBtn";

const ActionButton = ({ testID, label, onAction }) => {
    return (
        <>
            <PrimaryBtn
                testID={genTestId(`${testID}ActionButton`)}
                style={ForgotPasswordStyles.action_button}
                label={label}
                onPress={() => {
                    if (onAction) {
                        onAction();
                    }
                }}
            />
        </>
    );
};
export default ActionButton;
