/* eslint-disable qwik/valid-lexical-scope */
import { $, component$, useContextProvider, useWatch$ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { User, UserCreateInput } from "@nest-mikro-tenants/core/domain";
import { UserCreateFormData } from "@nest-mikro-tenants/frontend/common";
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
import { useCreateOneMutation } from "../../../hooks/use-create-one-mutation.hook";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";


export default component$(() => {
    // Set up the form
    const form = useFormState();
    useObjectForm($(() => UserCreateFormData), form);
    useContextProvider(FormStateContext, form);

    // Set up the mutation
    const results = useCreateOneMutation(
        $(() => User),
        $(() => UserCreateInput)
    );

    const saveUser$ = $(() => results.mutate$({
        input: UserCreateInput.plainFromSync(form.result)
    }));

    // Navigate back to users if the mutation succeeds
    const nav = useNavigate();
    useWatch$(({ track }) => {
        track(() => results.data);

        if (results.data)
            setTimeout(() => {
                nav.path = '/users';
            }, 500);
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
                        disabled={!form.result || results.loading.value}
                        onClick$={saveUser$}
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
