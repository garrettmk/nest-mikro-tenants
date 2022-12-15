import { $, component$, Resource } from "@builder.io/qwik";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereInput } from "@nest-mikro-tenants/core/domain";
import { findManyQuery } from "@nest-mikro-tenants/frontend/common";
import { useQuery } from "qwik-urql";
import { Table, TableColumn } from "../table/table";
import { UserActionsMenu } from "./user-actions-menu";

export function toLocaleDateString(value: unknown): string {
    return value 
        ? (new Date(value as string)).toLocaleDateString()
        : '--';
}

export interface UsersTableProps {
    users?: User[]
}


export const Query = $(() => findManyQuery(User, UsersWhereInput));

export const UsersTable = component$(() => {
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
            format: $((user) => <UserActionsMenu user={user as DataFields<User>}/>)
        }
    ]

    const query = useQuery(Query, undefined);

    return (
        <div>
            <Resource
                value={query}
                onPending={() => <span>Pending...</span>}
                onRejected={(error) => <span>{'' + error}</span>}
                onResolved={(result) => (
                    <Table
                        class="bg-slate-200 rounded-lg overflow-hidden w-full"
                        columns={columns}
                        items={result.data?.findManyUsers.items}
                    />
                )}
            />
        </div>
    );
});