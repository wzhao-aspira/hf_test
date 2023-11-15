import { ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AppTheme from "../../../assets/_default/AppTheme";
import { PAGE_MARGIN_BOTTOM } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";
import DrawSelectors from "../../../redux/DrawApplicationSelector";
import profileSelectors from "../../../redux/ProfileSelector";
import { getDrawList } from "../../../redux/DrawApplicationSlice";
import { useAppDispatch } from "../../../hooks/redux";

function DrawApplicationListScrollView({ children }) {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const refreshing = useSelector(DrawSelectors.selectIsDrawListLoading);
    const activeProfileId = useSelector(profileSelectors.selectCurrentInUseProfileID);

    const getDrawListByProfileId = () => {
        if (activeProfileId) {
            dispatch(getDrawList(activeProfileId));
        }
    };
    return (
        <ScrollView
            testID={genTestId("drawApplicationList")}
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
            {children}
        </ScrollView>
    );
}

export default DrawApplicationListScrollView;
