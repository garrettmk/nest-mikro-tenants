/* eslint-disable qwik/valid-lexical-scope */
import { $, component$, useContextProvider } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { User, UserCreateInput } from "@nest-mikro-tenants/core/domain";
import { createOneMutation, UserCreateFormData } from "@nest-mikro-tenants/frontend/common";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { CancelButton } from "../../../components/buttons/cancel-button";
import { SaveButton } from "../../../components/buttons/save-button";
import { CardHeader } from "../../../components/card/card-header";
import { CardSection } from "../../../components/card/card-section";
import { CardTitle } from "../../../components/card/card-title";
import { UserCreateForm } from "../../../components/forms/user-create-form";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { Toolbar } from "../../../components/toolbar/toolbar";
import { FormStateContext } from "../../../contexts/form-state.context";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useNotify } from "../../../hooks/use-notify.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";

export const createOneUserMutation$ = $(() => createOneMutation(User, UserCreateInput));

export default component$(() => {
    const nav = useNavigate();
    const notify = useNotify();

    // Set up the form
    const form = useFormState();
    useObjectForm($(() => UserCreateFormData), form);
    useContextProvider(FormStateContext, form);

    // Set up the mutation
    const createUser = useMutation({
        operation$: createOneUserMutation$,

        variables: $(() => ({
            input: UserCreateInput.plainFromSync(form.result)
        })),

        onData$: $(() => {
            notify.success$('User created successfully.')
            setTimeout(() => nav.path = '/users', 1000);
        }),

        onError$: notify.error$
    });

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <Breadcrumbs class="text-sm" items={[
                        {
                            text: 'Users',
                            href: '/users'
                        }
                    ]}/>
                    Create New User
                </PageTitle>

                <Toolbar>
                    <CancelButton
                        href="/users"
                    />
                    <SaveButton 
                        disabled={!form.result || createUser.loading.value}
                        onClick$={createUser.execute$}
                    />
                </Toolbar>
            </PageHeader>
            
            <CardSection class="mb-8">
                <CardHeader>
                    <CardTitle>
                        User Information
                    </CardTitle>
                </CardHeader>
                <UserCreateForm/>
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
    title: 'Admin - Create a User',
    meta: [
        {
            name: 'description',
            content: 'Create an application user',
        },
    ],
};
