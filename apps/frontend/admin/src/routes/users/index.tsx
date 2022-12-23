import { $, component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Serializable } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereInput } from "@nest-mikro-tenants/core/domain";
import { FindManyData, findManyQuery, FindManyVariables } from "@nest-mikro-tenants/frontend/common";
import { useQueryResource } from "@nest-mikro-tenants/frontend/qwurql";
import { OperationResult } from "@urql/core";
import { CreateButton } from "../../components/buttons/create-button";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";
import { Toolbar } from "../../components/toolbar/toolbar";
import { UsersTable } from "../../components/users/users-table";

export const findManyUsersQuery$ = $(() => findManyQuery(User, UsersWhereInput));

export default component$(() => {
    const findUsers = useQueryResource({
        operation$: findManyUsersQuery$,
        context: { additionalTypenames: ['User'] }
    });

    return (
        <>
            <PageHeader>
                <PageTitle>
                    Users
                </PageTitle>
                <Toolbar>
                    <CreateButton id="createbutton" href="/users/create"/>
                </Toolbar>
            </PageHeader>
            <section>
                <Resource
                    value={findUsers.resource$}
                    onPending={() => <span>Pending...</span>}
                    onRejected={() => <span>:-(</span>}
                    onResolved={result => <FindManyUsersResultTable result={result}/>}
                />
            </section>
        </>
    );
});

export interface FindManyUsersResultTableProps {
    result: Serializable<OperationResult<FindManyData<User>, FindManyVariables<User, UsersWhereInput>>>
}

export const FindManyUsersResultTable = component$(({ result }: FindManyUsersResultTableProps) => {
    return (
        <UsersTable
            class="bg-slate-200 rounded-lg overflow-hidden w-full"
            items={result.data?.findManyUsers.items}
        />
    );
})

export const head: DocumentHead = {
    title: 'Admin - Users',
    meta: [
        {
            name: 'description',
            content: 'Manage application users',
        },
    ],
};
