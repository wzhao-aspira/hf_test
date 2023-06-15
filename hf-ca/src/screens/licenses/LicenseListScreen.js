import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import AppContract from "../../assets/_default/AppContract";
import LicenseCardLoading from "./LicenseCardLoading";
import { PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import AppTheme from "../../assets/_default/AppTheme";
import LicenseItem from "./LicenseItem";
import LicenseListEmpty from "./LicenseListEmpty";
import { getLicenseData, getLoadingData } from "../../services/LicenseService";
import { genTestId } from "../../helper/AppHelper";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
});

const LicenseListScreen = (props) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();
    const [data, setData] = useState(getLoadingData());
    const [refreshing, setRefreshing] = useState(false);

    const getData = async () => {
        setRefreshing(true);
        const newData = await getLicenseData();
        setData(newData);
        setRefreshing(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Page style={styles.container}>
            <CommonHeader
                title={AppContract.strings.hf_pg_my_lic}
                onBackClick={() => {
                    navigation.goBack();
                }}
            />
            <FlatList
                testID={genTestId("licenseList")}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: insets.bottom + PAGE_MARGIN_BOTTOM,
                }}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={refreshing}
                        onRefresh={() => {
                            getData();
                        }}
                    />
                }
                scrollIndicatorInsets={{ right: 1 }}
                data={data}
                renderItem={({ item }) => {
                    if (item.isLoading) {
                        return <LicenseCardLoading />;
                    }

                    return (
                        <LicenseItem
                            onPress={() => {
                                console.log("go to license detail");
                            }}
                            itemData={item}
                            itemKey={item.id}
                        />
                    );
                }}
                keyExtractor={(item) => `${item.id}`}
                ListEmptyComponent={<LicenseListEmpty />}
            />
        </Page>
    );
};

export default LicenseListScreen;
