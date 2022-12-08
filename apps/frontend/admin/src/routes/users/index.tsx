import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import PageHeader from "../../components/header/page-header";

export default component$(() => {
    return (
        <>
            <PageHeader>
                Users
            </PageHeader>
            <section>
                User stuff
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
