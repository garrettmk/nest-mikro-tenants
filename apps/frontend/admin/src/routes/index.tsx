import { component$, useContext } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageHeader } from '../components/header/page-header';
import { PageTitle } from '../components/header/page-title';
import { NotificationsContext } from '../components/notifications/notifications-provider';

export default component$(() => {
    const { notify$, dismiss$ } = useContext(NotificationsContext);

    return (
        <>
            <PageHeader>
                <PageTitle>
                    Dashboard
                </PageTitle>
            </PageHeader>
            <section>
            </section>
        </>
    );
});

export const head: DocumentHead = {
    title: 'Welcome to Qwik',
    meta: [
        {
            name: 'description',
            content: 'Qwik site description',
        },
    ],
};
