import React from "react";
import { Text } from "react-native";
import { Trans } from "react-i18next";
import { SharedStyles } from "../../styles/CommonStyles";
import { genTestId } from "../../helper/AppHelper";
import ForgotPasswordStyles from "./ForgotPasswordScreenStyles";

const AttentionSection = ({ testID, attentionContent }) => {
    return (
        <>
            <Text testID={genTestId(`${testID}AttentionLabel`)} style={ForgotPasswordStyles.attention_label}>
                <Trans i18nKey="common.attention" />
            </Text>
            <Text testID={genTestId(`${testID}AttentionContent`)} style={SharedStyles.page_content_text}>
                <Trans i18nKey={attentionContent} />
            </Text>
        </>
    );
};
export default AttentionSection;
