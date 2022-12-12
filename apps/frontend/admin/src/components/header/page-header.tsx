import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
    return (
        <header class="-mx-4 -mt-4 p-4 mb-4 h-16 bg-slate-200 flex">
            <h1 class="text-2xl mr-auto">
                <Slot/>
            </h1>
            <Slot name="tools"/>
        </header>
    );
});
