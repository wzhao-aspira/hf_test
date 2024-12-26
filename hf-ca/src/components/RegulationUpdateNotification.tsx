import { appConfig } from "../services/AppConfigService";
import { SimpleDialog } from "./Dialog";
import NavigationService from "../navigation/NavigationService";
import { useSelector } from "react-redux";
import { selectNeedForceUpdate } from "../redux/AppSlice";
export function RegulationUpdateNotification(props) {
    const { outdetedRegulations } = props;
    const needForceUpdate = useSelector(selectNeedForceUpdate);
    const { outdatedRegulationHeading,
        outdatedRegulationTopInstructions,
        outdatedRegulationBottomInstructions } =
        appConfig.data;

    const dialogContent = `${outdatedRegulationTopInstructions || ""}\r\n\r\n${outdetedRegulations.map(n => "•  " + n.regulationTitle).join("\r\n")}\r\n\r\n${outdatedRegulationBottomInstructions || ""}`;
    return (
        <SimpleDialog
            title={outdatedRegulationHeading}
            message={dialogContent}
            messageStyle={{ textAlign: "left" }}
            okAction={() => { NavigationService.back(); }}
            visible={!needForceUpdate}
        />
    );
}
