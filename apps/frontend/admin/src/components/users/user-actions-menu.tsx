import { $, component$, useSignal, useWatch$ } from "@builder.io/qwik";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereOneInput } from "@nest-mikro-tenants/core/domain";
import { deleteOneMutation, DeleteOneMutationVariables } from "@nest-mikro-tenants/frontend/common";
import { PencilIcon, TrashIcon } from "heroicons-qwik/24/solid";
import { useMutation } from "qwik-urql";
import { CancelButton } from "../buttons/cancel-button";
import { DeleteButton } from "../buttons/delete-button";
import { MenuButton } from "../buttons/menu-button";
import { CardSection } from "../card/card-section";
import { MenuItem } from "../menu/menu-item";
import { Modal } from "../modal/modal";
import { Toolbar } from "../toolbar/toolbar";

export const DeleteUserMutation = $(() => deleteOneMutation(User, UsersWhereOneInput));
export type DeleteUserMutationVariables = DeleteOneMutationVariables<User, UsersWhereOneInput>;
export type DeleteUserMutationData = { deleteOneUser: DataFields<User> }

export interface UserActionsMenuProps {
    user: DataFields<User>
}

export const UserActionsMenu = component$((props: UserActionsMenuProps) => {
    const { user } = props;
    const isOpen = useSignal<boolean>(false);
    const mutation = useMutation(DeleteUserMutation, {
        where: { id: { eq: user.id } }
    });

    useWatch$(({ track }) => {
        track(() => mutation.data);

        console.log({ data: mutation.data });
    });

    return (
        <>
            <MenuButton class="bg-transparent border-none" size='md' fit>
                <MenuItem href={`/users/${user.id}`}>
                    <PencilIcon class="inline-block w-4 h-4 mr-4 text-gray-600"/>
                    Edit user
                </MenuItem>
                <MenuItem onClick$={() => isOpen.value = true }>
                    <TrashIcon class="inline-block w-4 h-4 mr-4 text-red-500"/>
                    Delete User
                </MenuItem>
            </MenuButton>
            <Modal isOpen={isOpen} onClose$={() => isOpen.value = false}>
                <CardSection class="">
                    <span class="block mb-4">
                        Are you sure you want to delete { user.nickname ?? user.username } ({ user.email })?
                        This can't be undone!
                    </span>
                    <Toolbar class="justify-end">
                        <CancelButton onClick$={() => isOpen.value = false}/>
                        <DeleteButton onClick$={mutation.delete$}/>
                    </Toolbar>
                </CardSection>
            </Modal>
        </>
    );
})