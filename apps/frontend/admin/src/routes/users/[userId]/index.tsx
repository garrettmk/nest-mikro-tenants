import { $, component$, Resource, useContextProvider, useStore, useWatch$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereOneInput, UserUpdateInput } from "@nest-mikro-tenants/core/domain";
import { GetVariables } from "@nest-mikro-tenants/frontend/common";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { CancelButton } from "../../../components/buttons/cancel-button";
import { DeleteButton } from "../../../components/buttons/delete-button";
import { SaveButton } from "../../../components/buttons/save-button";
import { CardHeader } from "../../../components/card/card-header";
import { CardSection } from "../../../components/card/card-section";
import { CardTitle } from "../../../components/card/card-title";
import { UserUpdateForm } from "../../../components/forms/user-update-form";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { ConfirmDeleteModal } from "../../../components/modals/confirm-delete-modal";
import { DeleteUserModal } from "../../../components/modals/delete-user-modal";
import { ErrorOverlay } from "../../../components/overlays/error-overlay";
import { LoadingOverlay } from "../../../components/overlays/loading-overlay";
import { Toolbar } from "../../../components/toolbar/toolbar";
import { FormStateContext } from "../../../contexts/form-state.context";
import { useDeleteOneMutation } from "../../../hooks/use-delete-one-mutation.hook";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useGetQueryResource } from "../../../hooks/use-get-query.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";
import { useResourceLoading } from "../../../hooks/use-resource-loading.hook";
import { useToggle } from "../../../hooks/use-toggle.hook";
import { useUpdateOneMutation } from "../../../hooks/use-update-one-mutation.hook";


export default component$(() => {
    const location = useLocation();
    const variables = useStore<GetVariables>({ id: location.params.userId });
    const getUser = useGetQueryResource($(() => User), variables);
    
    return <Resource
        value={getUser.resource$}
        onPending={() => <LoadingOverlay/>}
        onRejected={error => <ErrorOverlay>{error + ''}</ErrorOverlay>}
        onResolved={result => <UserUpdatePage user={result.data?.getUser as User}/>}
        // onResolved={result => (
        //     <pre>
        //         {JSON.stringify(result, null, '  ')}
        //     </pre>
        // )}
    />
});

export interface UserUpdatePageProps {
    user: DataFields<User>
}

export const UserUpdatePage = component$((props: UserUpdatePageProps) => {
    const { user } = props;
    const nav = useNavigate();
    
    // Set up the form
    const form = useFormState(() => UserUpdateInput.plainFromSync(user));
    useObjectForm($(() => UserUpdateInput), form);
    useContextProvider(FormStateContext, form);

    // Set up the update mutation
    const updateUser = useUpdateOneMutation(
        $(() => User),
        $(() => UsersWhereOneInput),
        $(() => UserUpdateInput),
        { where: { id: { eq: user.id } } },
    );
    
    const saveUser$ = $(() => updateUser.execute$({
        update: form.result!
    }));

    // Set up the delete mutation and confirm modal
    const deleteUser = useDeleteOneMutation(
        $(() => User),
        $(() => UsersWhereOneInput),
        { where: { id: { eq: user.id } } }
    );
            
    const [isConfirmDeleteOpen, { on$: showConfirmDelete$ }] = useToggle();

    // Navigate back if the mutation succeeds
    useWatch$(({ track }) => {
        const updateResult = track(updateUser.result);
        const deleteResult = track(deleteUser.result);
        const goBack = () => setTimeout(() => { nav.path = '/users'; }, 500);

        if (updateResult.value?.data || deleteResult.value?.data)
            goBack();
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
                        // disabled={isBusy}
                        onClick$={showConfirmDelete$}
                    />
                    <SaveButton
                        disabled={!form.isModified || !form.isValid || isBusy}
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
                <UserUpdateForm/>
            </CardSection>

            <DeleteUserModal
                isOpen={isConfirmDeleteOpen}
                user={user}
            />
        </>
    );
})