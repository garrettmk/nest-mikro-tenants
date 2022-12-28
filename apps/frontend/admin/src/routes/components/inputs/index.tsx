import { component$ } from "@builder.io/qwik";
import { CardHeader, CardSection, CardTitle, SelectInput, TextInput } from "@nest-mikro-tenants/frontend/qwik-ui";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";

export default component$(() => {
    return (
        <>
        <PageHeader>
            <PageTitle>
                Inputs
            </PageTitle>
        </PageHeader>
        <CardSection>
            <CardHeader>
                <CardTitle>
                    Text
                </CardTitle>
            </CardHeader>
            <p className="mt-2 [&>*]:mt-2">
                <TextInput label='TextInput'/>
                <TextInput label='TextInput (password=true)' password/>
                <TextInput label='TextInput w/error' errors={['This is an error']}/>
            </p>
        </CardSection>
        <CardSection class='mt-4'>
            <CardHeader>
                <CardTitle>
                    Select
                </CardTitle>
            </CardHeader>
            <p>
                <SelectInput label='SelectInput' errors={['Booooo']}>
                    <option>One</option>
                    <option>Two</option>
                </SelectInput>
            </p>
        </CardSection>
        </>
    );
})