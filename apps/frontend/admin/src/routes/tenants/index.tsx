import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/header/page-header";

export default component$(() => {
    return (
        <>
            <PageHeader>
                Tenants
            </PageHeader>
            <section>
                Tenant stuff
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
