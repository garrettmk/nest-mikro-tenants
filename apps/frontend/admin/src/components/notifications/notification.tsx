import { component$, useContext, useMount$ } from "@builder.io/qwik";
import { CloseButton } from "../buttons/close-button";
import { Notification, NotificationsContext } from "./notifications-provider";

export const NotificationComponent = component$((props: Notification) => {
    const { id, text, autoDismiss = true, variant = 'info' } = props;
    const { dismiss$ } = useContext(NotificationsContext);

    useMount$(() => {
        if (autoDismiss) {
            const timeout = typeof autoDismiss === 'number' ? autoDismiss : 5000;
            
            setTimeout(() => {
                dismiss$(id);
            }, timeout);
        }
    });

    const backgroundColor = {
        info: 'bg-slate-500',
        success: 'bg-green-500',
        error: 'bg-red-500'
    }[variant];

    const classNames = `
        p-4 m-2 rounded-md drop-shadow-lg
        flex items-center
        ${backgroundColor} text-white 
    `;

    return (
        <div class={classNames}>
            <span class="mr-auto">
                {text}
            </span>
            <CloseButton
                class="ml-4"
                onClick$={() => dismiss$(id)}
            />
        </div>
    );
})