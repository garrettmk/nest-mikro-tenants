import { $, component$ } from "@builder.io/qwik";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { User } from "@nest-mikro-tenants/core/domain";
import { Table, TableColumn, TableProps } from "../table/table";
import { UserActionsMenu } from "./user-actions-menu";

export function toLocaleDateString(value: unknown): string {
    return value 
        ? (new Date(value as string)).toLocaleDateString()
        : '--';
}

export interface UsersTableProps extends Omit<TableProps, 'items' | 'columns'> {
    items?: Serializable<User>[]
}

export const UsersTable = component$((props: UsersTableProps) => {
    const columns: TableColumn[] = [
        {
            label: 'ID',
            dataKey: 'id'
        },
        {
            label: 'Name',
            dataKey: 'nickname'
        },
        {
            label: 'Username',
            dataKey: 'username'
        },
        {
            label: 'Email',
            dataKey: 'email'
        },
        {
            label: 'Status',
            dataKey: 'status',
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
            format: $((user) => <UserActionsMenu user={user as Serializable<User>}/>)
        }
    ];
    
    return (
        <Table columns={columns} {...props}/>
    );
});