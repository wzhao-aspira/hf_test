import { Linking } from "react-native";
import RNRenderHtml from "react-native-render-html";
import type { RenderHTMLProps } from "react-native-render-html";

import useNavigateToIS from "../hooks/useNavigateToIS";

function RenderHTML(props: RenderHTMLProps) {
    const { renderersProps } = props;

    const { getAdditionalInfoQueryString } = useNavigateToIS();

    return (
        <RNRenderHtml
            {...props}
            renderersProps={{
                a: {
                    onPress: (event, href) => {
                        const AUTO_LOGIN_FLAG = "AUTO_LOGIN_QUERY_PARAMETERS";

                        const shouldAutoLogin = href.includes(AUTO_LOGIN_FLAG);

                        const URL = shouldAutoLogin
                            ? href.replace(AUTO_LOGIN_FLAG, getAdditionalInfoQueryString(true))
                            : href;

                        Linking.openURL(URL);
                    },
                },
                ...renderersProps,
            }}
        />
    );
}

export default RenderHTML;
