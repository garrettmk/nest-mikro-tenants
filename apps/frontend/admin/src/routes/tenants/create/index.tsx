/* eslint-disable qwik/valid-lexical-scope */
import { $, component$, useContextProvider } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { Tenant, TenantCreateInput } from "@nest-mikro-tenants/core/domain";
import { createOneMutation } from "@nest-mikro-tenants/frontend/common";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";
import { Toolbar, Breadcrumbs, CancelButton, SaveButton, CardHeader, CardSection, CardTitle } from '@nest-mikro-tenants/frontend/qwik-ui';
import { TenantCreateForm } from "./tenant-create-form";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { FormStateContext } from "../../../contexts/form-state.context";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useNotify } from "../../../hooks/use-notify.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";

export const createOneTenantMutation$ = $(() => createOneMutation(Tenant, TenantCreateInput));

export default component$(() => {
    const nav = useNavigate();
    const notify = useNotify();

    // Set up the form
    const form = useFormState();
    useObjectForm($(() => TenantCreateInput), form);
    useContextProvider(FormStateContext, form);

    // Set up the mutation
    const createTenant = useMutation({
        operation$: createOneTenantMutation$,

        variables: $(() => ({
            input: TenantCreateInput.plainFromSync(form.result)
        })),

        onData$: $(() => {
            notify.success$('Tenant created successfully.')
            setTimeout(() => nav.path = '/tenants', 1000);
        }),

        onError$: notify.error$
    });

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <Breadcrumbs class="text-sm" items={[
                        {
                            text: 'Tenants',
                            href: '/tenants'
                        }
                    ]}/>
                    Create New Tenant
                </PageTitle>

                <Toolbar>
                    <CancelButton
                        href="/tenants"
                    />
                    <SaveButton 
                        disabled={!form.result || createTenant.loading.value}
                        onClick$={$(() => createTenant.execute$)}
                    />
                </Toolbar>
            </PageHeader>
            
            <CardSection class="mb-8">
                <CardHeader>
                    <CardTitle>
                        Tenant Information
                    </CardTitle>
                </CardHeader>
                <TenantCreateForm/>
            </CardSection>

            <CardSection>
                <CardHeader>
                    <CardTitle>
                        Tenant Assignments
                    </CardTitle>
                </CardHeader>
                Tenant info
            </CardSection>
        </>
    );
});

export const head: DocumentHead = {
    title: 'Admin - Create a Tenant',
    meta: [
        {
            name: 'description',
            content: 'Create an application tenant',
        },
    ],
};
