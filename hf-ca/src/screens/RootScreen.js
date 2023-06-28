import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import AppNavigator from "../navigation/AppNavigator";
import {
    hideSelectDialog,
    hideSimpleDialog,
    selectIndicator,
    selectLoginStep,
    selectSelectDialog,
    selectSimpleDialog,
    updateLoginStep,
} from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import { Indicator, SelectDialog, SimpleDialog } from "../components/Dialog";
import { genTestId } from "../helper/AppHelper";
import { retrieveItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { getMobileAccountById } from "../helper/DBHelper";

export default function RootScreen() {
    const dispatch = useDispatch();
    const loginStep = useSelector(selectLoginStep);
    const simpleDialog = useSelector(selectSimpleDialog);
    const selectDialog = useSelector(selectSelectDialog);
    const indicator = useSelector(selectIndicator);
    const getMobileAccountInfoFromDB = async () => {
        const lastUsedMobileAccountId = await retrieveItem(KEY_CONSTANT.keyLastUsedMobileAccountId);
        if (!isEmpty(lastUsedMobileAccountId)) {
            const dbResult = await getMobileAccountById(lastUsedMobileAccountId);
            if (dbResult.success) {
                const mobileAccountInfo = dbResult.account;
                if (!isEmpty(mobileAccountInfo)) {
                    // TODO:
                    // Set profiles to redux based on the profileIds
                    // dispatch(setProfileList());
                    // Update the current in use profile based on the currentInUseProfileId
                    // dispatch(updateActiveProfileByID());
                }
            }
            // TODO:
            // dispatch(updateUsername(lastUsedMobileAccountId));
            dispatch(updateLoginStep(LoginStep.home));
        }
    };

    useEffect(() => {
        getMobileAccountInfoFromDB();
    }, [loginStep]);
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1 }}
                edges={loginStep !== LoginStep.login ? null : ["left", "right"]}
                accessible
            >
                <StatusBar translucent />
                <AppNavigator />
                <SimpleDialog
                    {...simpleDialog}
                    testID={genTestId("simpleDialog")}
                    okAction={() => {
                        dispatch(hideSimpleDialog());
                        simpleDialog?.okAction && simpleDialog.okAction();
                    }}
                />
                <SelectDialog
                    {...selectDialog}
                    testID={genTestId("selectDialog")}
                    okAction={() => {
                        dispatch(hideSelectDialog());
                        selectDialog.okAction && selectDialog.okAction();
                    }}
                    cancelAction={() => {
                        dispatch(hideSelectDialog());
                        selectDialog.cancelAction && selectDialog.cancelAction();
                    }}
                />
                <Indicator testID={genTestId("appIndicator")} visible={indicator} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
