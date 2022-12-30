import { $, component$, Resource, useContextProvider, useStore } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { User, UsersWhereOneInput, UserUpdateInput } from "@nest-mikro-tenants/core/domain";
import { deleteOneMutation, getQuery, GetVariables, updateOneMutation, UserUpdateFormData } from "@nest-mikro-tenants/frontend/common";
import { Breadcrumbs, CancelButton, CardHeader, CardSection, CardTitle, ConfirmDeleteModal, DeleteButton, SaveButton, Toolbar } from "@nest-mikro-tenants/frontend/qwik-ui";
import { useMutation, useQueryResource } from "@nest-mikro-tenants/frontend/qwurql";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { ErrorOverlay } from "../../../components/overlays/error-overlay";
import { LoadingOverlay } from "../../../components/overlays/loading-overlay";
import { FormStateContext } from "../../../contexts/form-state.context";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useNotify } from "../../../hooks/use-notify.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";
import { useToggle } from "../../../hooks/use-toggle.hook";
import { UserUpdateForm } from './user-update-form';

/** Queries and mutations */
export const getUserQuery$ = $(() => getQuery(User));
export const updateUserMutation$ = $(() => updateOneMutation(User, UsersWhereOneInput, UserUpdateInput));
export const deleteUserMutation$ = $(() => deleteOneMutation(User, UsersWhereOneInput));

/** Data wrapper */
export default component$(() => {
    const location = useLocation();
    const variables = useStore<GetVariables>({ id: location.params.userId });
    const getUser = useQueryResource(getUserQuery$, variables);
    
    return <Resource
        value={getUser.resource$}
        onPending={() => <LoadingOverlay/>}
        onRejected={error => <ErrorOverlay>{error + ''}</ErrorOverlay>}
        onResolved={result => <UserUpdatePage user={result.data?.getUser as User}/>}
    />
});

/** Main page component */
export interface UserUpdatePageProps {
    user: User
}

export const UserUpdatePage = component$((props: UserUpdatePageProps) => {
    const { user } = props;
    const nav = useNavigate();
    const notify = useNotify();
    const goBack$ = $(() => setTimeout(() => { nav.path = '/users'; }, 1000));
    
    // Set up the form
    const form = useFormState(() => UserUpdateFormData.plainFromSync(user as unknown as UserUpdateFormData));
    useObjectForm($(() => UserUpdateFormData), form);
    useContextProvider(FormStateContext, form);

    // Set up the update mutation
    const updateUser = useMutation({
        operation$: updateUserMutation$,
        variables: $(() => ({ where: { id: { eq: user.id } }, update: form.result! })),
        onData$: $(() => { notify.success$('User saved'); goBack$() }),
        onError$: notify.error$
    });

    
    // Set up the delete mutation and confirm modal
    const isConfirmDeleteOpen = useToggle();
    
    const deleteUser = useMutation({
        operation$: deleteUserMutation$,
        variables: { where: { id: { eq: user.id } } },
        onExecute$: isConfirmDeleteOpen.off$,
        onData$: $(() => { notify.success$('User deleted'); goBack$() }),
        onError$: notify.error$
    });
            

    const isBusy = updateUser.loading.value || deleteUser.loading.value;

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
                    Update User
                </PageTitle>

                <Toolbar>
                    <CancelButton href="/users"/>
                    <DeleteButton
                        disabled={isBusy}
                        onClick$={isConfirmDeleteOpen.on$}
                    />
                    <SaveButton
                        disabled={!form.isModified || !form.isValid || isBusy}
                        onClick$={$(() => updateUser.execute$())}
                    />
                </Toolbar>
            </PageHeader>

            <CardSection class="mb-8">
                <CardHeader>
                    <CardTitle>
                        User Information
                    </CardTitle>
                </CardHeader>
                <UserUpdateForm/>
            </CardSection>

            <ConfirmDeleteModal
                itemName={user.nickname ?? user.username}
                isOpen={isConfirmDeleteOpen}
                onDelete$={deleteUser.execute$}
            />
        </>
    );
})