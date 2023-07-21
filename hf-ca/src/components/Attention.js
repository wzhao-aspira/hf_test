import { Text } from "react-native";
import { Trans } from "react-i18next";
import { SharedStyles } from "../styles/CommonStyles";
import { genTestId } from "../helper/AppHelper";

function Attention({ testID = "", labelKey = "common.attention", contentKey }) {
    return (
        <>
            <Text testID={genTestId(`${testID}AttentionLabel`)} style={SharedStyles.attention_label}>
                <Trans i18nKey={labelKey} />
            </Text>
            <Text testID={genTestId(`${testID}AttentionContent`)} style={SharedStyles.page_content_text}>
                <Trans i18nKey={contentKey} />
            </Text>
        </>
    );
}
export default Attention;
