import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Button } from '../components/buttons/button';
import { MenuButton } from '../components/buttons/menu-button';
import { CardSection } from '../components/card/card-section';
import { PageHeader } from '../components/header/page-header';
import { PageTitle } from '../components/header/page-title';
import { MenuItem } from '../components/menu/menu-item';
import { Modal } from '../components/modal/modal';

export default component$(() => {
    const isOpen = useSignal(false);
    const count = useSignal(0);

    return (
        <>
            <PageHeader>
                <PageTitle>
                    Dashboard
                </PageTitle>
            </PageHeader>
            <section>

                <MenuButton class="mb-6" size='sm'>
                    <MenuItem href="/users">One</MenuItem>
                    <MenuItem>Two</MenuItem>
                    <MenuItem>Three</MenuItem>
                </MenuButton>

                <Button onClick$={() => { isOpen.value = true }}>
                    Modal
                </Button>
                <Modal isOpen={isOpen} onClose$={() => isOpen.value = false}>
                    <CardSection class="max-w-sm">
                        Are you sure?
                        <Button class="mt-4" onClick$={() => count.value++}>
                            {count.value}
                        </Button>
                    </CardSection>
                </Modal>
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
