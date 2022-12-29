import { $, component$ } from "@builder.io/qwik";
import { User, UsersWhereOneInput } from "@nest-mikro-tenants/core/domain";
import { deleteOneMutation } from "@nest-mikro-tenants/frontend/common";
import { ConfirmDeleteModal, MenuButton, MenuItem } from "@nest-mikro-tenants/frontend/qwik-ui";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";
import { PencilIcon, TrashIcon } from "heroicons-qwik/24/solid";
import { useToggle } from "../../hooks/use-toggle.hook";

export interface UserActionsMenuProps {
    user: User
}

export const deleteUserMutation$ = $(() => deleteOneMutation(User, UsersWhereOneInput));

export const UserActionsMenu = component$((props: UserActionsMenuProps) => {
    const { user } = props;
    const isConfirmModalOpen = useToggle();
    const deleteUser = useMutation({
        operation$: deleteUserMutation$,
        variables: { where: { id: { eq: user.id } } },
        onExecute$: isConfirmModalOpen.off$,
        context: { additionalTypenames: ['User'] }
    });

    return (
        <>
            <MenuButton class="bg-transparent border-none" size='md' fit>
                <MenuItem href={`/users/${user.id}`}>
                    <PencilIcon class="inline-block w-4 h-4 mr-4 text-gray-600"/>
                    Edit user
                </MenuItem>
                <MenuItem onClick$={isConfirmModalOpen.on$}>
                    <TrashIcon class="inline-block w-4 h-4 mr-4 text-red-500"/>
                    Delete User
                </MenuItem>
            </MenuButton>
            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onDelete$={deleteUser.execute$}
            />
        </>
    );
})