import { $, component$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { Tenant } from "@nest-mikro-tenants/core/domain";
import { Table, TableColumn, TableProps, toLocaleDateString } from '@nest-mikro-tenants/frontend/qwik-ui';
import { TenantActionsMenu } from "./tenant-actions-menu";


export interface TenantsTableProps extends Omit<TableProps, 'items' | 'columns'> {
    items?: Tenant[]
}

export const TenantsTable = component$((props: TenantsTableProps) => {
    const columns: TableColumn[] = [
        {
            label: 'ID',
            dataKey: 'id'
        },
        {
            label: 'Name',
            dataKey: 'name'
        },
        {
            label: 'Slug',
            dataKey: 'slug'
        },
        {
            label: 'Date Created',
            dataKey: 'createdAt',
            format: $(toLocaleDateString)
            
        },
        {
            label: 'Date Updated',
            dataKey: 'updatedAt',
            format: $(toLocaleDateString)
        },
        {
            label: 'Actions',
            classes: 'flex justify-center',
            format: $((user) => <TenantActionsMenu user={user as Serializable<Tenant>}/>)
        }
    ];
    
    return (
        <Table columns={columns} {...props}/>
    );
});