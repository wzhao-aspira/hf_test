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

const HFAppModule = {
    checkBiometricsChanged,
    showBiometricPrompt,
};

export default HFAppModule;
