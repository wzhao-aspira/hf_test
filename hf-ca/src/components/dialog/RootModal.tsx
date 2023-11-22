import { Modal } from "react-native";
import { SimpleDialogView, SelectDialogView } from "../Dialog";
import { DialogConfig } from "./type";
import useDialog from "./useDialog";

function Content({ dialogState }: { dialogState: DialogConfig }) {
    const { closeDialog } = useDialog();
    const {
        title,
        message,
        okText,
        cancelText,
        isSelect = false,
        onCancel,
        onConfirm = () => {},
        renderContent,
    } = dialogState || {};

    if (renderContent) {
        return renderContent();
    }
    if (!isSelect) {
        return (
            <SimpleDialogView
                testID="globalSimpleDialog"
                title={title}
                message={message}
                okText={okText}
                okAction={() => {
                    closeDialog();
                    setTimeout(() => {
                        onConfirm();
                    });
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
                closeDialog();
                if (onCancel) {
                    setTimeout(() => {
                        onCancel();
                    });
                }
            }}
            okAction={() => {
                closeDialog();
                setTimeout(() => {
                    onConfirm();
                });
            }}
        />
    );
}

export default function RootModal() {
    const { dialogState } = useDialog();
    const { open } = dialogState || {};
    console.log(dialogState);

    return (
        <Modal visible={open} animationType="none" transparent>
            <Content dialogState={dialogState} />
        </Modal>
    );
}
