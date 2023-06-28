import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import emailValidator from "email-validator";
import { genTestId } from "../../helper/AppHelper";
import StatefulTextInput from "../../components/StatefulTextInput";
import AppTheme from "../../assets/_default/AppTheme";
import { emptyError, emptyValidate } from "../profile/add_profile/ProfileValidate";
import PrimaryBtn from "../../components/PrimaryBtn";
import NavigationService from "../../navigation/NavigationService";
import Routers from "../../constants/Routers";
import { checkAccountEmailIsExisting } from "../../services/ProfileService";
import { showSimpleDialog, updateLoginStep } from "../../redux/AppSlice";
import LoginStep from "../../constants/LoginStep";

const SignUp = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [mobileAccount, setMobileAccount] = useState();
    const userIDRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const validate = () => {
        const errorOfUserID = emptyValidate(mobileAccount?.userID, t("errMsg.emptyUserID"));
        userIDRef?.current.setError(errorOfUserID);
        const errorOfPassword = emptyValidate(mobileAccount?.password, t("errMsg.emptyPassword"));
        passwordRef?.current.setError(errorOfPassword);
        const errorOfConfirmPassword = emptyValidate(mobileAccount?.confirmPassword, t("errMsg.emptyConfirmPassword"));
        confirmPasswordRef?.current.setError(errorOfConfirmPassword);
        return errorOfUserID.error || errorOfPassword.error || errorOfConfirmPassword.error;
    };
    const onSave = async () => {
        const errorReported = validate();
        if (errorReported) return;
        if (!emailValidator.validate(mobileAccount.userID)) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "signIn.userIdInvalid",
                    okText: "common.gotIt",
                })
            );
            return;
        }
        if (mobileAccount.password !== mobileAccount.confirmPassword) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.passwordDotNotMatch",
                    okText: "common.gotIt",
                })
            );
            return;
        }
        const existing = await checkAccountEmailIsExisting(mobileAccount.userID);
        if (existing) {
            dispatch(
                showSimpleDialog({
                    title: "common.error",
                    message: "errMsg.foundExistingAccount",
                    okText: "common.gotIt",
                })
            );
            return;
        }
        NavigationService.navigate(Routers.addPrimaryProfile, { mobileAccount });
    };
    return (
        <View>
            <StatefulTextInput
                testID={genTestId("UserIDInput")}
                label={t("common.userID")}
                hint={t("common.pleaseEnterEmail")}
                ref={userIDRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(userID) => {
                    setMobileAccount({ ...mobileAccount, userID });
                    userIDRef.current.setError(emptyError);
                }}
                value={mobileAccount?.userID}
                onBlur={() => {
                    const error = emptyValidate(mobileAccount?.userID, t("errMsg.emptyUserID"));
                    userIDRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("PasswordInput")}
                label={t("common.password")}
                hint={t("common.pleaseEnter")}
                password
                ref={passwordRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(password) => {
                    setMobileAccount({ ...mobileAccount, password });
                    passwordRef.current.setError(emptyError);
                }}
                value={mobileAccount?.password}
                onBlur={() => {
                    const error = emptyValidate(mobileAccount?.password, t("errMsg.emptyPassword"));
                    passwordRef?.current.setError(error);
                }}
            />
            <StatefulTextInput
                testID={genTestId("ConfirmPasswordInput")}
                label={t("common.confirmPassword")}
                hint={t("common.pleaseEnter")}
                password
                ref={confirmPasswordRef}
                style={{ marginTop: 20 }}
                labelStyle={{ color: AppTheme.colors.font_color_1 }}
                inputStyle={{ backgroundColor: AppTheme.colors.font_color_4 }}
                onChangeText={(confirmPassword) => {
                    setMobileAccount({ ...mobileAccount, confirmPassword });
                    confirmPasswordRef.current.setError(emptyError);
                }}
                value={mobileAccount?.confirmPassword}
                onBlur={() => {
                    const error = emptyValidate(mobileAccount?.confirmPassword, t("errMsg.emptyConfirmPassword"));
                    confirmPasswordRef?.current.setError(error);
                }}
            />
            <PrimaryBtn style={{ marginTop: 40 }} label={t("common.create")} onPress={onSave} />
            <Text
                testID={genTestId("signInText")}
                style={{
                    marginTop: 20,
                    alignSelf: "center",
                    ...AppTheme.typography.sub_section,
                    color: AppTheme.colors.font_color_1,
                }}
            >
                {t("signUp.alreadyHaveAccount")}
                <Text
                    testID={genTestId("signInLink")}
                    style={{ ...AppTheme.typography.card_title, color: AppTheme.colors.primary_2 }}
                    onPress={() => {
                        dispatch(updateLoginStep(LoginStep.signIn));
                    }}
                >
                    {` ${t("login.signIn")}`}
                </Text>
            </Text>
        </View>
    );
};

export default SignUp;
