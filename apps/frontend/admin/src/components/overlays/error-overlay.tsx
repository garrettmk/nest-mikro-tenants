import { HTMLAttributes } from "@builder.io/qwik"
import { FaceFrownIcon } from "heroicons-qwik/24/outline";

export type ErrorOverlayProps = HTMLAttributes<HTMLDivElement>;

export const ErrorOverlay = (props: ErrorOverlayProps) => {
    const { class: classProp, children, ...divProps } = props;

    return (
        <div
            class={`absolute inset-0 ${classProp}`}
            {...divProps}
        >
            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <FaceFrownIcon class="mx-auto w-12 h-12 text-gray-600"/>
                {children}
            </div>
        </div>
    );
}