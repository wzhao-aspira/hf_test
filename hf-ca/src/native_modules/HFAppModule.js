import { NativeModules } from "react-native";

const { HFApp } = NativeModules;

const checkBiometricsChanged = async () => {
    const changed = await HFApp.checkBiometricsChanged();

    return changed;
};

// android only
const showBiometricPrompt = async (obj) => {
    const result = await HFApp.showBiometricPrompt(obj);
    return result;
};

const supportClass3Auth = async () => {
    const class3Auth = await HFApp.supportClass3Auth();
    return class3Auth;
};

const HFAppModule = {
    checkBiometricsChanged,
    showBiometricPrompt,
    supportClass3Auth,
};

export default HFAppModule;
