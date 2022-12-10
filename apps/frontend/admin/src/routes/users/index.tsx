import { $, component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import PageHeader from "../../components/header/page-header";
import ClassMetadataView from "../../components/objects/class-metadata";
import { UserCreateInput } from "@nest-mikro-tenants/core/domain";

export default component$(() => {
    return (
        <>
            <PageHeader>
                Users
            </PageHeader>
            <section>
                <ClassMetadataView type={$(() => UserCreateInput)}/>
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
