import { Modal } from "react-native";
import { SimpleDialogView, SelectDialogView } from "../components/Dialog";
import { DialogActions } from "../helper/DialogHelper";
import NavigationService from "./NavigationService";

function Content({ title, message, okText, cancelText, isSelect = false, custom = false }) {
    if (custom) {
        return DialogActions.renderContent();
    }
    if (!isSelect) {
        return (
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
    }
    return (
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
    );
}

export default function ModalScreen({ route = {} }) {
    const { params = {} } = route;
    const { title, message, okText, cancelText, isSelect = false, withModal = false, custom = false } = params;
    console.log(params);

    if (!withModal) {
        return (
            <Content
                title={title}
                message={message}
                okText={okText}
                cancelText={cancelText}
                isSelect={isSelect}
                custom={custom}
            />
        );
    }
    return (
        <Modal animationType="none" transparent>
            <Content
                title={title}
                message={message}
                okText={okText}
                cancelText={cancelText}
                isSelect={isSelect}
                custom={custom}
            />
        </Modal>
    );
}
