import { NativeModules } from "react-native";

const { HFApp } = NativeModules;

const checkBiometricsChanged = async () => {
    const changed = await HFApp.checkBiometricsChanged();

    return changed;
};

const HFAppModule = {
    checkBiometricsChanged,
};

export default HFAppModule;
