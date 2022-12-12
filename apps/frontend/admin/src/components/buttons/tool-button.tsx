import { component$, Slot } from "@builder.io/qwik";


export default component$(() => {
    const styles = `
        p-2 text-xs uppercase flex items-center
        rounded-md border-2 border-slate-300
        bg-slate-300 hover:bg-slate-200 active:bg-slate-100
        focus:ring-2 ring-blue-300 outline-none
    `
    return (
        <button class={styles}>
            <Slot/>
        </button>
    );
})