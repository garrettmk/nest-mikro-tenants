import { component$ } from "@builder.io/qwik";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";
import { Button, CancelButton, CloseButton, CreateButton, DeleteButton, SaveButton, CardSection, CardHeader, CardTitle } from "@nest-mikro-tenants/frontend/qwik-ui";

export default component$(() => {
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Buttons
                </PageTitle>
            </PageHeader>
            <CardSection>
                <CardHeader>
                    <CardTitle>
                        Basic Buttons
                    </CardTitle>
                </CardHeader>
                <p className="[&>*]:mr-2">
                    <Button>Default</Button>
                    <Button color='gray'>Gray</Button>
                    <Button color='blue'>Blue</Button>
                    <Button color='green'>Green</Button>
                    <Button color='red'>Red</Button>
                </p>

                <p className="mt-2 [&>*]:mr-2">
                    <Button variant='bordered'>Default</Button>
                    <Button variant='bordered' color='gray'>Gray</Button>
                    <Button variant='bordered' color='blue'>Blue</Button>
                    <Button variant='bordered' color='green'>Green</Button>
                    <Button variant='bordered' color='red'>Red</Button>
                </p>
                
                <p className="mt-2 [&>*]:mr-2">
                    <Button size='sm'>Default</Button>
                    <Button size='sm' color='gray'>Gray</Button>
                    <Button size='sm' color='blue'>Blue</Button>
                    <Button size='sm' color='green'>Green</Button>
                    <Button size='sm' color='red'>Red</Button>
                </p>
            </CardSection>
            <CardSection class="mt-4">
                <CardHeader>
                    <CardTitle>
                        Semantic Buttons
                    </CardTitle>
                </CardHeader>
                <p className="[&>*]:mr-2">
                    <CancelButton/>
                    <CancelButton>Cancel</CancelButton>
                    <CloseButton/>
                    <CloseButton>Close</CloseButton>
                    <CreateButton/>
                    <CreateButton>Create</CreateButton>
                    <DeleteButton/>
                    <DeleteButton>Delete</DeleteButton>
                    <SaveButton/>
                    <SaveButton>Save</SaveButton>
                </p>
            </CardSection>
        </>
    )
})