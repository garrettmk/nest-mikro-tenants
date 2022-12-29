import { $, component$, useWatch$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { Tenant, TenantsWhereInput } from "@nest-mikro-tenants/core/domain";
import { findManyQuery } from "@nest-mikro-tenants/frontend/common";
import { CreateButton, Toolbar } from "@nest-mikro-tenants/frontend/qwik-ui";
import { useLiveQuery } from "@nest-mikro-tenants/frontend/qwurql";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";
import { TenantsTable } from "./tenants-table";

export const findManyTenantsQuery$ = $(() => findManyQuery(Tenant, TenantsWhereInput));

export default component$(() => {
    const findTenants = useLiveQuery({
        operation$: findManyTenantsQuery$,
        context: { additionalTypenames: ['Tenant'] }
    });

    useWatch$(() => {
        findTenants.execute$();
    })

    return (
        <>
            <PageHeader>
                <PageTitle>
                    Tenants
                </PageTitle>
                <Toolbar>
                    <CreateButton href='/tenants/create'/>
                </Toolbar>
            </PageHeader>
            <section>
                {findTenants.result.value ? (
                    <TenantsTable
                        class='bg-slate-200 rounded-lg overflow-hidden w-full'
                        items={findTenants.result.value?.data?.findManyTenants.items}
                    />
                ) : (
                    <span>Loading</span>
                )}
            </section>
        </>
    );
});

export const head: DocumentHead = {
    title: 'Admin - Tenants',
    meta: [
        {
            name: 'description',
            content: 'Manage application tenants',
        },
    ],
};
