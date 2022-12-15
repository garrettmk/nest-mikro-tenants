import { $, component$, Resource, useContextProvider, useStore, useWatch$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { DataFields } from "@nest-mikro-tenants/core/common";
import { User, UsersWhereOneInput, UserUpdateInput } from "@nest-mikro-tenants/core/domain";
import { getQuery, updateOneMutation, UpdateOneVariables } from "@nest-mikro-tenants/frontend/common";
import { useMutation, useQuery } from "qwik-urql";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { CancelButton } from "../../../components/buttons/cancel-button";
import { SaveButton } from "../../../components/buttons/save-button";
import { CardHeader } from "../../../components/card/card-header";
import { CardSection } from "../../../components/card/card-section";
import { CardTitle } from "../../../components/card/card-title";
import { UserUpdateForm } from "../../../components/forms/user-update-form";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { Toolbar } from "../../../components/toolbar/toolbar";
import { FormStateContext } from "../../../contexts/form-state.context";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";

export const GetUserQuery = $(() => getQuery(User, 'User'));
export const UpdateUserMutation = $(() => updateOneMutation(User, 'User', UsersWhereOneInput, UserUpdateInput));

export interface UpdateUserState {
    getUserVariables: { id: string },
}

export default component$(() => {
    const location = useLocation();
    const variables = useStore({ id: location.params.userId });
    const query = useQuery(GetUserQuery, variables);

    return <Resource
        value={query}
        onPending={() => <span>Loading...</span>}
        onRejected={() => <span>:-(</span>}
        onResolved={result => <UserUpdatePage user={result.data?.getUser!}/>}
    />
});

export interface UserUpdatePageProps {
    user: DataFields<User>
}

export const UserUpdatePage = component$((props: UserUpdatePageProps) => {
    const { user } = props;
    const nav = useNavigate();

    const state = useFormState(() => UserUpdateInput.plainFromSync(user));
    useObjectForm($(() => UserUpdateInput), state);
    useContextProvider(FormStateContext, state);

    const results = useMutation(UpdateUserMutation);
    
    const saveUser$ = $(() => results.mutate$({
        where: { id: { eq: user.id } },
        update: state.result!
    }));

    useWatch$(({ track }) => {
        track(() => results.data);

        if (results.data?.updateOneUser)
            nav.path = '/users'
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
                    Update User
                </PageTitle>

                <Toolbar>
                    <CancelButton href="/users"/>
                    <SaveButton
                        disabled={!state.isModified || !state.isValid || results.loading.value}
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
        </>
    );
})