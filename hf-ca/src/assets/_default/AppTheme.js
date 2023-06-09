import { merge } from "lodash";
import BaseTheme from "../BaseTheme";

const AppTheme = {
    colors: {},
    typography: {},
};
export default merge(BaseTheme, AppTheme);
