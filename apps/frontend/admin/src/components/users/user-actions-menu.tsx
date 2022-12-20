import { $, component$ } from "@builder.io/qwik";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereOneInput } from "@nest-mikro-tenants/core/domain";
import { PencilIcon, TrashIcon } from "heroicons-qwik/24/solid";
import { useDeleteOneMutation } from "../../hooks/use-delete-one-mutation.hook";
import { useToggle } from "../../hooks/use-toggle.hook";
import { MenuButton } from "../buttons/menu-button";
import { MenuItem } from "../menu/menu-item";
import { ConfirmDeleteModal } from "../modals/confirm-delete-modal";

export interface UserActionsMenuProps {
    user: DataFields<User>
}

export const UserActionsMenu = component$((props: UserActionsMenuProps) => {
    const { user } = props;
    const [isConfirmDeleteOpen, { on$: openConfirmModal$}] = useToggle();
    const mutation = useDeleteOneMutation(
        $(() => User),
        $(() => UsersWhereOneInput),
        { where: { id: { eq: user.id } } }
    );

    return (
        <>
            <MenuButton class="bg-transparent border-none" size='md' fit>
                <MenuItem href={`/users/${user.id}`}>
                    <PencilIcon class="inline-block w-4 h-4 mr-4 text-gray-600"/>
                    Edit user
                </MenuItem>
                <MenuItem onClick$={openConfirmModal$}>
                    <TrashIcon class="inline-block w-4 h-4 mr-4 text-red-500"/>
                    Delete User
                </MenuItem>
            </MenuButton>
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onDelete$={mutation.mutate$}
            />
        </>
    );
})