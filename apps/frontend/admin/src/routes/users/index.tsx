import { $, component$, Resource, useWatch$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { User, UsersWhereInput } from "@nest-mikro-tenants/core/domain";
import { CreateButton } from "../../components/buttons/create-button";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";
import { Toolbar } from "../../components/toolbar/toolbar";
import { UsersTable } from "../../components/users/users-table";
import { useFindManyQueryResource } from "../../hooks/use-find-many-query.hook";

export default component$(() => {
    const query = useFindManyQueryResource(
        $(() => User),
        $(() => UsersWhereInput)
    );

    useWatch$(() => {
        query.execute$();
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
                    value={query.resource$}
                    onPending={() => <span>Pending...</span>}
                    onRejected={() => <span>:-(</span>}
                    onResolved={result => (
                        <UsersTable
                            class="bg-slate-200 rounded-lg overflow-hidden w-full"
                            items={result.data?.findManyUsers.items}
                        />
                    )}
                />
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
