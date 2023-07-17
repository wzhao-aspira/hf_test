import Reactotron from "reactotron-react-native";
import { isAndroid } from "./src/helper/AppHelper";

const host = isAndroid() ? "10.0.2.2" : "127.0.0.1";

Reactotron.configure({ host, port: 9090 }) // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!
