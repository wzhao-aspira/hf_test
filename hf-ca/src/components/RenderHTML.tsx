import { Linking } from "react-native";
import RNRenderHtml from "react-native-render-html";
import type { RenderHTMLProps as RNRenderHTMLProps } from "react-native-render-html";

import useNavigateToIS from "../hooks/useNavigateToIS";

interface RenderHTMLProps extends RNRenderHTMLProps {
    customerID: string;
}

function RenderHTML(props: RenderHTMLProps) {
    const { renderersProps, customerID = null, ...restProps } = props;

    const { getAdditionalInfoQueryString } = useNavigateToIS();

    return (
        <RNRenderHtml
            {...restProps}
            renderersProps={{
                a: {
                    onPress: (event, href) => {
                        const AUTO_LOGIN_FLAG = "AUTO_LOGIN_QUERY_PARAMETERS";

                        const shouldAutoLogin = href.includes(AUTO_LOGIN_FLAG);

                        const URL = shouldAutoLogin
                            ? href.replace(
                                  AUTO_LOGIN_FLAG,
                                  getAdditionalInfoQueryString({ openInBrowser: true, customerID })
                              )
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
