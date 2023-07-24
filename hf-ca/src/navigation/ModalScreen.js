import { Modal } from "react-native";
import { SimpleDialogView, SelectDialogView } from "../components/Dialog";
import { DialogActions } from "../helper/DialogHelper";
import NavigationService from "./NavigationService";

export default function ModalScreen({ route = {} }) {
    const { params = {} } = route;
    const { title, message, okText, cancelText, isSelect = false, withModal = false } = params;

    const Content = isSelect ? (
        <SelectDialogView
            testID="globalSelectDialog"
            title={title}
            message={message}
            okText={okText}
            cancelText={cancelText}
            cancelAction={() => {
                NavigationService.back();
                const cancel = DialogActions.selCancelAction;
                cancel?.();
            }}
            okAction={() => {
                NavigationService.back();
                const ok = DialogActions.selOkAction;
                ok?.();
            }}
        />
    ) : (
        <SimpleDialogView
            testID="globalSimpleDialog"
            title={title}
            message={message}
            okText={okText}
            okAction={() => {
                NavigationService.back();
                const act = DialogActions.okAction;
                act?.();
            }}
        />
    );

    if (!withModal) {
        return <Content />;
    }
    return (
        <Modal animationType="none" transparent>
            <Content />
        </Modal>
    );
}
