import { Linking } from "react-native";
import RNRenderHtml from "react-native-render-html";
import type { RenderHTMLProps as RNRenderHTMLProps } from "react-native-render-html";

import useNavigateToIS from "../hooks/useNavigateToIS";

interface RenderHTMLProps extends RNRenderHTMLProps {
    customerID?: string;
}

function RenderHTML(props: RenderHTMLProps) {
    const { renderersProps, customerID = null, source, ...restProps } = props;

    const { navigateToIS } = useNavigateToIS();

    if ("html" in source && !source?.html) {
        return null;
    }

    return (
        <RNRenderHtml
            {...restProps}
            source={source}
            renderersProps={{
                a: {
                    onPress: (event, href) => {
                        const AUTO_LOGIN_FLAG = "AUTO_LOGIN_QUERY_PARAMETERS";

                        const shouldAutoLogin = href.includes(AUTO_LOGIN_FLAG);
                        if (shouldAutoLogin) {
                            const targetPath = href.substring(
                                href.indexOf("AutoLoginForMobile?targetPath=%2") + 33,
                                href.indexOf("&AUTO_LOGIN_QUERY_PARAMETERS")
                            );
                            navigateToIS({ targetPath: `/${targetPath}`, customerID });
                        } else {
                            Linking.openURL(href);
                        }
                    },
                },
                ...renderersProps,
            }}
        />
    );
}

export default RenderHTML;
