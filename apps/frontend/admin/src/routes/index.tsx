import { component$, useSignal, useContext } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Button } from '../components/buttons/button';
import { MenuButton } from '../components/buttons/menu-button';
import { CardSection } from '../components/card/card-section';
import { PageHeader } from '../components/header/page-header';
import { PageTitle } from '../components/header/page-title';
import { MenuItem } from '../components/menu/menu-item';
import { Modal } from '../components/modals/modal';
import { NotificationsContext } from '../components/notifications/notifications-provider';
import { Panel } from '@nest-mikro-tenants/frontend/qwik-ui';

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
                <Panel/>

                <MenuButton class="mb-6" size='sm'>
                    <MenuItem href="/users">One</MenuItem>
                    <MenuItem>Two</MenuItem>
                    <MenuItem>Three</MenuItem>
                </MenuButton>

                <Button onClick$={() => notify$({
                    id: 'two',
                    text: 'Another!'
                })}>
                    Modal
                </Button>

                <Button onClick$={() => dismiss$('two')}>
                    Dismiss
                </Button>
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
