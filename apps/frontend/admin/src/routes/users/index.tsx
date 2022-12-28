import { $, component$, useWatch$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { User, UsersWhereInput } from "@nest-mikro-tenants/core/domain";
import { findManyQuery } from "@nest-mikro-tenants/frontend/common";
import { CreateButton, Toolbar } from "@nest-mikro-tenants/frontend/qwik-ui";
import { useLiveQuery } from "@nest-mikro-tenants/frontend/qwurql";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";
import { UsersTable } from "./users-table";

export const findManyUsersQuery$ = $(() => findManyQuery(User, UsersWhereInput));

export default component$(() => {
    const findUsers = useLiveQuery({
        operation$: findManyUsersQuery$,
        context: { additionalTypenames: ['User'] }
    });

    useWatch$(() => {
        findUsers.execute$();
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
                {findUsers.result.value ? (
                    <UsersTable 
                        class={"bg-slate-200 rounded-lg overflow-hidden w-full"}
                        items={findUsers.result.value?.data?.findManyUsers.items}
                    />
                ) : (
                    <span>Loading</span>
                )}
                {/* <Resource
                    value={findUsers.resource$}
                    onPending={() => <span>Pending...</span>}
                    onRejected={() => <span>:-(</span>}
                    onResolved={result => <FindManyUsersResultTable result={result}/>}
                /> */}
            </section>
        </>
    );
});

export const head: DocumentHead = {
    title: 'Admin - Users',
    meta: [
        {
            name: 'description',
            content: 'Manage application users',
        },
    ],
};
