import { component$, useSignal } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import ToolButton from "../../components/buttons/tool-button";
import PageHeader from "../../components/header/page-header";
import { UsersTable } from "../../components/users/users-table";
import { PlusIcon } from "heroicons-qwik/20/solid";

export default component$(() => {
    return (
        <>
            <PageHeader>
                Users
                <div q:slot="tools" class="flex">
                    <ToolButton>
                        <PlusIcon class="pr-1 inline-block h-6 w-6"/>
                        Create
                    </ToolButton>
                </div>
            </PageHeader>
            <section>
                <UsersTable/>
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
