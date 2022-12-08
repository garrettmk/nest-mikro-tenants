import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import PageHeader from '../components/header/page-header';

export default component$(() => {
    return (
        <>
            <PageHeader>
                Index
            </PageHeader>
            <section>
                Some text
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
