import { $, component$, Resource, useContextProvider } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { Tenant, TenantsWhereOneInput, TenantUpdateInput } from "@nest-mikro-tenants/core/domain";
import { deleteOneMutation, getQuery, updateOneMutation } from "@nest-mikro-tenants/frontend/common";
import { Breadcrumbs, CancelButton, CardHeader, CardSection, CardTitle, ConfirmDeleteModal, DeleteButton, FormStateContext, SaveButton, Toolbar } from "@nest-mikro-tenants/frontend/qwik-ui";
import { useMutation, useQueryResource } from "@nest-mikro-tenants/frontend/qwurql";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { ErrorOverlay } from "../../../components/overlays/error-overlay";
import { LoadingOverlay } from "../../../components/overlays/loading-overlay";
import { useFormState } from "../../../hooks/use-form-state.hook";
import { useNotify } from "../../../hooks/use-notify.hook";
import { useObjectForm } from "../../../hooks/use-object-form.hook";
import { useToggle } from "../../../hooks/use-toggle.hook";
import { TenantUpdateForm } from "./tenant-update-form";

/** Queries and mutations */
export const getTenantQuery$ = $(() => getQuery(Tenant));
export const updateTenantMutation$ = $(() => updateOneMutation(Tenant, TenantsWhereOneInput, TenantUpdateInput));
export const deleteTenantMutation$ = $(() => deleteOneMutation(Tenant, TenantsWhereOneInput));

/** Data wrapper */
export default component$(() => {
    const location = useLocation();
    const getTenant = useQueryResource(getTenantQuery$, {
        id: location.params.tenantId
    });

    return (
        <Resource
            value={getTenant.resource$}
            onPending={() => <LoadingOverlay/>}
            onRejected={error => <ErrorOverlay>{error + ''}</ErrorOverlay>}
            onResolved={result => <TenantUpdatePage tenant={result.data?.getTenant as Tenant}/>}
        />
    );
});

/** Main page component */
export interface TenantUpdatePageProps {
    tenant: Tenant
}

export const TenantUpdatePage = component$((props: TenantUpdatePageProps) => {
    const { tenant } = props;
    const nav = useNavigate();
    const notify = useNotify();
    const goBack$ = $(() => setTimeout(() => { nav.path = '/tenants' }, 1000));

    // Set up the form
    const form = useFormState(() => TenantUpdateInput.plainFromSync(tenant));
    useObjectForm($(() => TenantUpdateInput), form);
    useContextProvider(FormStateContext, form);

    console.log({ tenant, form });

    // Set up the update mutation
    const updateTenant = useMutation({
        operation$: updateTenantMutation$,
        
        variables: $(() => ({
            where: { id: { eq: tenant.id } },
            update: form.result!
        })),

        onData$: $(() => {
            notify.success$('Tenant saved'); 
            goBack$();
        }),

        onError$: notify.error$
    });

    // Set up the delete mutation and modal
    const isConfirmDeleteOpen = useToggle();

    const deleteTenant = useMutation({
        operation$: deleteTenantMutation$,
        variables: { where: { id: { eq: tenant.id } } },
        onExecute$: isConfirmDeleteOpen.off$,
        onData$: $(() => {
            notify.success$('Tenant deleted');
            goBack$();
        }),
        onError$: notify.error$
    });

    const isBusy = updateTenant.loading.value || deleteTenant.loading.value;

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
                    Update Tenant
                </PageTitle>
                <Toolbar>
                    <CancelButton href='/tenants'/>
                    <DeleteButton onClick$={isConfirmDeleteOpen.on$} disabled={isBusy}/>
                    <SaveButton
                        disabled={!form.isModified || !form.isValid || isBusy}
                        onClick$={$(() => updateTenant.execute$())}
                    />
                </Toolbar>
            </PageHeader>

            <CardSection>
                <CardHeader>
                    <CardTitle>
                        Tenant Information
                    </CardTitle>
                </CardHeader>
                <TenantUpdateForm/>
            </CardSection>

            <ConfirmDeleteModal
                itemName={tenant.name}
                isOpen={isConfirmDeleteOpen}
                onDelete$={deleteTenant.execute$}
            />
        </>
    );
})