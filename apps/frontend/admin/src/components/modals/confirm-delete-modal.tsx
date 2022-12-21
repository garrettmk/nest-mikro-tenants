import { $, component$, PropFunction } from "@builder.io/qwik";
import { CancelButton } from "../buttons/cancel-button";
import { DeleteButton } from "../buttons/delete-button";
import { CardSection } from "../card/card-section";
import { Modal, ModalProps } from "../modals/modal";
import { Toolbar } from "../toolbar/toolbar";


export interface ConfirmDeleteModalProps extends ModalProps {
    itemName?: string
    onCancel$?: PropFunction<() => void>
    onDelete$?: PropFunction<() => void>
}

export const ConfirmDeleteModal = component$((props: ConfirmDeleteModalProps) => {
    const { itemName = 'this', ...modalProps } = props;
    
    const handleCancel$ = $(() => {
        if (props.onCancel$)
            props.onCancel$();
        else if (props.isOpen)
            props.isOpen.value = false;
    });

    const handleDelete$ = $(() => {
        if (props.onDelete$)
            props.onDelete$()
    });

    return (
        <Modal {...modalProps}>
            <CardSection class="">
                <span class="block mb-4">
                    Are you sure you want to delete { itemName }?
                    This can't be undone!
                </span>
                <Toolbar class="justify-end">
                    <CancelButton onClick$={handleCancel$}/>
                    <DeleteButton onClick$={handleDelete$}/>
                </Toolbar>
            </CardSection>
        </Modal>
    );
})