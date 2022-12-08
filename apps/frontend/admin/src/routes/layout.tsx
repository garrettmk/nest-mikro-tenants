import { component$, Slot } from '@builder.io/qwik';
import { Navigation } from '../components/navigation/navigation';

export default component$(() => {
    return (
        <div class="dark bg-slate-900 h-full pl-80 relative">
            <nav class="absolute w-80 left-0 top-0 bottom-0">
                <Navigation/>
            </nav>
            <main class="bg-slate-100 rounded-xl p-4 h-[calc(100vh-24px)] overflow-auto">
                <Slot />
            </main>
            <footer class="h-[24px] dark:text-white text-center">
                <a href="https://www.builder.io/" target="_blank">
                    Made with ♡ by Builder.io
                </a>
            </footer>
        </div>
    );
});
