import { component$ } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import { CreateButton } from "../../components/buttons/create-button";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";
import { Toolbar } from "../../components/toolbar/toolbar";
import { UsersTable } from "../../components/users/users-table";

export default component$(() => {
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
