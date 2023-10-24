import { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import { SelectDialog } from "../../components/Dialog";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

import { useAppDispatch } from "../../hooks/redux";
import { thunkActions as accountThunkActions } from "../../redux/AccountSlice";

import NavigationService from "../../navigation/NavigationService";
import { genTestId } from "../../helper/AppHelper";

import AccountService from "../../services/AccountService";

import { updateLoginStep, selectors as appSelectors } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";
import Attention from "../../components/Attention";

function DeleteAccountScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const accountID = useSelector(appSelectors.selectUsername);

    const [password, setPassword] = useState("");
    const [passwordInputInlineErrorMessage, setPasswordInputInlineErrorMessage] = useState("");
    const [shouldShowConfirmDialog, setShouldShowConfirmDialog] = useState(false);

    const passwordInputRef = useRef<{ setError: Function }>();

    useEffect(() => {
        if (passwordInputRef?.current && passwordInputRef.current?.setError) {
            passwordInputRef.current.setError({
                error: !!passwordInputInlineErrorMessage,
                errorMsg: passwordInputInlineErrorMessage,
            });
        }
    }, [passwordInputInlineErrorMessage]);

    async function handlePasswordInputInlineError() {
        const result = await AccountService.verifyPassword(password);

        if (result === "failed: password is empty") {
            const emptyPasswordErrorMessage = t("errMsg.emptyPassword");
            setPasswordInputInlineErrorMessage(emptyPasswordErrorMessage);
            return "failed";
        }

        setPasswordInputInlineErrorMessage("");

        return result;
    }

    async function pressVerifyAndContinueButtonHandler() {
        const result = await handlePasswordInputInlineError();

        if (result === "passed") setShouldShowConfirmDialog(true);
    }

    async function pressProceedDeleteHandler() {
        setShouldShowConfirmDialog(false);

        try {
            const result = await dispatch(accountThunkActions.deleteCurrentAccount(password));

            if (result === "succeeded") {
                dispatch(updateLoginStep(LoginStep.login));
            }

            if (result === "failed") {
                // TODO: handle failed
            }
        } catch (error) {
            // TODO: handle error
        }
    }

    function backToThePreviousScreen() {
        NavigationService.back();
    }

    const titleText = t("deleteAccount.pageTitle");

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader title={titleText} rightIcon={false} />
            <ScrollView testID={genTestId("DeleteAccountScrollView")} style={{ paddingHorizontal: DEFAULT_MARGIN }}>
                <Page style={{ flex: 1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Attention labelKey="deleteAccount.attention" contentKey="deleteAccount.description" />
                    </View>
                    <View style={{ marginBottom: 25 }}>
                        <StatefulTextInput
                            // @ts-expect-error
                            password
                            testID={genTestId("accountPasswordInput")}
                            hint={t("common.pleaseEnter")}
                            label={t("deleteAccount.accountPassword")}
                            labelStyle={{ ...AppTheme.typography.card_title, color: AppTheme.colors.black }}
                            ref={passwordInputRef}
                            onChangeText={setPassword}
                            onBlur={handlePasswordInputInlineError}
                        />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <PrimaryBtn
                            testID={genTestId("verifyAndContinueButton")}
                            label={t("deleteAccount.verifyAndContinue")}
                            onPress={pressVerifyAndContinueButtonHandler}
                        />
                    </View>
                    <View>
                        <OutlinedBtn
                            testID={genTestId("cancelButton")}
                            label={t("common.cancel")}
                            onPress={() => {
                                backToThePreviousScreen();
                            }}
                        />
                    </View>
                    <SelectDialog
                        visible={shouldShowConfirmDialog}
                        title={t("deleteAccount.deletingAccountPermanently")}
                        message={t("deleteAccount.confirmDialogDescription", { accountID })}
                        okText={t("deleteAccount.proceedDelete")}
                        cancelText={t("common.cancel")}
                        okAction={pressProceedDeleteHandler}
                        cancelAction={() => {
                            setShouldShowConfirmDialog(false);
                        }}
                    />
                </Page>
            </ScrollView>
        </View>
    );
}

export default DeleteAccountScreen;
