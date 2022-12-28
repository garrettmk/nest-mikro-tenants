import { component$ } from "@builder.io/qwik";
import { CardSection, CardHeader, CardTitle, Menu, MenuItem, MenuButton } from "@nest-mikro-tenants/frontend/qwik-ui";
import { PageHeader } from "../../../components/header/page-header";
import { PageTitle } from "../../../components/header/page-title";

export default component$(() => {
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Menus
                </PageTitle>
            </PageHeader>
            <CardSection>
                <CardHeader>
                    <CardTitle>
                        Menu Sizes
                    </CardTitle>
                </CardHeader>
                <p className="[&>*]:mr-8 flex">
                    <Menu size='sm' class="py-32 flex items-center justify-center">
                        Small
                    </Menu>

                    <Menu size='md' class="py-32 flex items-center justify-center">
                        Medium
                    </Menu>

                    <Menu size='lg' class="py-32 flex items-center justify-center">
                        Large
                    </Menu>
                </p>
            </CardSection>

            <CardSection class="mt-4">
                <CardHeader>
                    <CardTitle>
                        Menu Items
                    </CardTitle>
                </CardHeader>
                <p className="[&>*]:mr-8 flex items-start">
                    <Menu size='sm'>
                        <MenuItem>One</MenuItem>
                        <MenuItem>Two</MenuItem>
                        <MenuItem>Three</MenuItem>
                    </Menu>

                    <Menu size='md'>
                        <MenuItem>One</MenuItem>
                        <MenuItem>Two</MenuItem>
                        <MenuItem>Three</MenuItem>
                    </Menu>

                    <Menu size='lg'>
                        <MenuItem>One</MenuItem>
                        <MenuItem>Two</MenuItem>
                        <MenuItem>Three</MenuItem>
                    </Menu>
                </p>
            </CardSection>

            <CardSection class="mt-4">
                <CardHeader>
                    <CardTitle>
                        Menu Button
                    </CardTitle>
                </CardHeader>
                <p className="[&>*]:mr-8 flex items-start">
                    <MenuButton size='sm'>
                        <MenuItem>One</MenuItem>
                        <MenuItem>Two</MenuItem>
                        <MenuItem>Three</MenuItem>
                    </MenuButton>

                    <MenuButton size='md'>
                        <MenuItem>One</MenuItem>
                        <MenuItem>Two</MenuItem>
                        <MenuItem>Three</MenuItem>
                    </MenuButton>
                </p>
            </CardSection>
        </>
    );
})