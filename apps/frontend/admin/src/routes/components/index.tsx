import { component$ } from "@builder.io/qwik";
import { PageHeader } from "../../components/header/page-header";
import { PageTitle } from "../../components/header/page-title";

export default component$(() => {
    return (
        <PageHeader>
            <PageTitle>
                Components
            </PageTitle>
        </PageHeader>
    )
})