import { useState, useRef, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from "react-redux";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import StatefulTextInput from "../../components/StatefulTextInput";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import { SelectDialog, SimpleDialog } from "../../components/Dialog";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

import { useAppDispatch } from "../../hooks/redux";
import { thunkActions as accountThunkActions } from "../../redux/AccountSlice";

import NavigationService from "../../navigation/NavigationService";
import { genTestId } from "../../helper/AppHelper";

import AccountService from "../../services/AccountService";

import { updateLoginStep, selectors as appSelectors } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";

const styles = StyleSheet.create({
    paragraphSpacing: {
        marginBottom: 20,
    },
});

function DeleteAccountScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const accountID = useSelector(appSelectors.selectUsername);

    const [password, setPassword] = useState("");
    const [passwordInputError, setPasswordInputError] = useState("");
    const [shouldShowPasswordDoNotMatchDialog, setShouldShowPasswordDoNotMatchDialog] = useState(false);
    const [shouldShowConfirmDialog, setShouldShowConfirmDialog] = useState(false);

    const passwordInputRef = useRef<{ setError: Function }>();

    useEffect(() => {
        if (passwordInputRef?.current && passwordInputRef.current?.setError) {
            passwordInputRef.current.setError({ error: !!passwordInputError, errorMsg: passwordInputError });
        }
    }, [passwordInputError]);

    async function handlePasswordInputInlineError() {
        const result = await AccountService.verifyCurrentAccountPassword(password);

        setPasswordInputError("");

        if (result === "failed: password is empty") {
            const emptyPasswordErrorMessage = t("errMsg.emptyPassword");
            setPasswordInputError(emptyPasswordErrorMessage);
            return "failed";
        }

        return result;
    }

    async function verifyAccountPasswordAndHandleError() {
        const result = await handlePasswordInputInlineError();

        if (result === "failed: password do not match") {
            setShouldShowPasswordDoNotMatchDialog(true);
            return "failed";
        }

        return result;
    }

    async function pressVerifyAndContinueButtonHandler() {
        const result = await verifyAccountPasswordAndHandleError();

        if (result === "passed") setShouldShowConfirmDialog(true);
    }

    async function pressProceedDeleteHandler() {
        try {
            const result = await dispatch(accountThunkActions.deleteCurrentAccount(password));

            if (result === "succeeded") {
                dispatch(updateLoginStep(LoginStep.login));
            }
        } catch (error) {
            // TODO: handle error
        }

        setShouldShowConfirmDialog(false);
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
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ ...AppTheme.typography.card_title, ...styles.paragraphSpacing }}>
                            <Trans i18nKey="deleteAccount.attention" />
                        </Text>
                        <Text style={{ ...AppTheme.typography.card_title }}>
                            <Trans i18nKey="deleteAccount.description1" />
                        </Text>
                        <Text style={{ ...AppTheme.typography.sub_section, ...styles.paragraphSpacing }}>
                            <Trans i18nKey="deleteAccount.description2" />
                        </Text>
                        <Text style={{ ...AppTheme.typography.sub_section, ...styles.paragraphSpacing }}>
                            <Trans i18nKey="deleteAccount.description3" />
                        </Text>
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
                    <SimpleDialog
                        visible={shouldShowPasswordDoNotMatchDialog}
                        title="deleteAccount.passwordDoesNotMatchDialog.title"
                        message="deleteAccount.passwordDoesNotMatchDialog.description"
                        okText="deleteAccount.passwordDoesNotMatchDialog.confirmButton"
                        okAction={() => {
                            setShouldShowPasswordDoNotMatchDialog(false);
                        }}
                    />
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
