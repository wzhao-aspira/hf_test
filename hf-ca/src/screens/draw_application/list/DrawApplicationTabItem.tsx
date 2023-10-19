import { StyleSheet, ScrollView, Text, RefreshControl } from "react-native";
// import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";
import DrawApplicationListEmpty from "./DrawApplicationListEmpty";
import AppTheme from "../../../assets/_default/AppTheme";
import DrawSelectors from "../../../redux/DrawApplicationSelector";
import { REQUEST_STATUS } from "../../../constants/Constants";
import profileSelectors from "../../../redux/ProfileSelector";
import { getDrawList } from "../../../redux/DrawApplicationSlice";

export const styles = StyleSheet.create({});
function DrawApplicationTabItem({ list }) {
    // const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const drawRequestStatus = useSelector(DrawSelectors.selectDrawRequestStatus);
    const refreshing = drawRequestStatus.requestStatus === REQUEST_STATUS.pending;
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            // @ts-ignore
            dispatch(getDrawList(activeProfileId));
        }
    };

    if (isEmpty(list)) {
        return <DrawApplicationListEmpty />;
    }

    return (
        <ScrollView
            testID={genTestId("drawList")}
            contentContainerStyle={{
                flexGrow: 1,
                marginTop: 14,
                paddingBottom: insets.bottom + PAGE_MARGIN_BOTTOM,
            }}
            refreshControl={
                <RefreshControl
                    colors={[AppTheme.colors.primary]}
                    tintColor={AppTheme.colors.primary}
                    refreshing={refreshing}
                    onRefresh={() => {
                        getDrawListByProfileId();
                    }}
                />
            }
        >
            <Text>Draw</Text>
        </ScrollView>
    );
}

export default DrawApplicationTabItem;
