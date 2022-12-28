import { $, component$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { Tenant, TenantsWhereOneInput } from "@nest-mikro-tenants/core/domain";
import { deleteOneMutation } from "@nest-mikro-tenants/frontend/common";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";
import { PencilIcon, TrashIcon } from "heroicons-qwik/24/solid";
import { useToggle } from "../../hooks/use-toggle.hook";
import { MenuButton, MenuItem, ConfirmDeleteModal } from "@nest-mikro-tenants/frontend/qwik-ui";

export interface TenantActionsMenuProps {
    user: Serializable<Tenant>
}

export const deleteTenantMutation$ = $(() => deleteOneMutation(Tenant, TenantsWhereOneInput));

export const TenantActionsMenu = component$((props: TenantActionsMenuProps) => {
    const { user } = props;
    const isConfirmModalOpen = useToggle();
    const deleteTenant = useMutation({
        operation$: deleteTenantMutation$,
        variables: { where: { id: { eq: user.id } } },
        onExecute$: isConfirmModalOpen.off$,
        context: { additionalTypenames: ['Tenant'] }
    });

    return (
        <>
            <MenuButton class="bg-transparent border-none" size='md' fit>
                <MenuItem href={`/users/${user.id}`}>
                    <PencilIcon class="inline-block w-4 h-4 mr-4 text-gray-600"/>
                    Edit Tenant
                </MenuItem>
                <MenuItem onClick$={isConfirmModalOpen.on$}>
                    <TrashIcon class="inline-block w-4 h-4 mr-4 text-red-500"/>
                    Delete Tenant
                </MenuItem>
            </MenuButton>
            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onDelete$={deleteTenant.execute$}
            />
        </>
    );
})