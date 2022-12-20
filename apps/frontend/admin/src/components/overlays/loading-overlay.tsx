import { HTMLAttributes } from "@builder.io/qwik";
import { LoadingIcon } from "../icons/loading-icon";

export type LoadingOverlayProps = HTMLAttributes<HTMLDivElement>;

export const LoadingOverlay = (props: LoadingOverlayProps) => {
    const { class: classProp, children, ...divProps } = props;

    return (
        <div
            class={`absolute inset-0 ${classProp}`}
            {...divProps}
        >
            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <LoadingIcon class="stroke-blue-500"/>
                {/* <img src="/oval.svg" alt="loading" class="mx-auto w-12 h-12 stroke-blue-500"/> */}
                {children}
            </div>
        </div>
    );
}