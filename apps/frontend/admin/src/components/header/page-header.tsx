import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
    return (
        <header class="-mx-4 -mt-4 p-4 mb-4 h-16 bg-slate-200 text-2xl flex">
            <Slot/>
        </header>
    );
});
