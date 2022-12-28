import { component$ } from "@builder.io/qwik";
import { CardSection, CardHeader, CardTitle } from "@nest-mikro-tenants/frontend/qwik-ui";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";

export default component$(() => {
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Layout
                </PageTitle>
            </PageHeader>
            <CardSection>
                <CardHeader>
                    <CardTitle>
                        CardSection
                    </CardTitle>
                </CardHeader>
            </CardSection>
        </>
    )
})