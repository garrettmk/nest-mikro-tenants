import { $, component$, PropFunction, useSignal } from "@builder.io/qwik";
import { User } from "@nest-mikro-tenants/core/domain";
import { CancelButton } from "../buttons/cancel-button";
import { DeleteButton } from "../buttons/delete-button";
import { CardSection } from "../card/card-section";
import { Modal, ModalProps } from "../modals/modal";
import { Toolbar } from "../toolbar/toolbar";
import { UserDeleteMutation } from "../users/user-delete-mutation";


export interface DeleteUserModalProps extends ModalProps {
    user: User
    onCancel$?: PropFunction<() => void>
}

export const DeleteUserModal = component$((props: DeleteUserModalProps) => {
    const { user, isOpen, onCancel$, ...modalProps } = props;
    
    const handleCancel$ = $(() => {
        if (onCancel$)
            onCancel$();
        else if (isOpen)
            isOpen.value = false;
    });

    const confirmed = useSignal(false);

    return (
        <>
            <Modal isOpen={isOpen} {...modalProps}>
                <CardSection class="">
                    <span class="block mb-4">
                        Are you sure you want to delete { user.nickname ?? user.username }?
                        This can't be undone!
                    </span>
                    <Toolbar class="justify-end">
                        <CancelButton onClick$={handleCancel$}/>
                        <DeleteButton onClick$={$(() => confirmed.value = true)}/>
                    </Toolbar>
                </CardSection>
            </Modal>
            {confirmed.value && (
                <UserDeleteMutation where={{ id: { eq: user.id } }}/>
            )}
        </>
    );
})