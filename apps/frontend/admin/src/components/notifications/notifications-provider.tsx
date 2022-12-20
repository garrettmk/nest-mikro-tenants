import { $, component$, createContext, QRL, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import cuid from "cuid";
import { NotificationComponent } from "./notification";

export interface Notification {
    id: string
    text: string
    autoDismiss?: boolean | number
    variant?: 'info' | 'success' | 'error'
}

export interface NotificationProviderState {
    notifications: Notification[]
}

export interface NotificationsContextState {
    notify$: QRL<((notification: Notification) => void)>
    dismiss$: QRL<((id: string) => void)>

    info$: QRL<(mesage: string, options?: Partial<Notification>) => void>
    success$: QRL<(message: string, options?: Partial<Notification>) => void>
    error$: QRL<(error: unknown, options?: Partial<Notification>) => void>
}

export const NotificationsContext = createContext<NotificationsContextState>('notifications-context');

export const NotificationsProvider = component$(() => {
    // All currently shown notifications
    const state = useStore<NotificationProviderState>({
        notifications: []
    }, {
        recursive: true
    });

    // Methods for showing/hiding notifications
    const context = useStore<NotificationsContextState>({
        notify$: $((notification: Notification) => {
            state.notifications.push(notification);
        }),

        dismiss$: $((id: string) => {
            const index = state.notifications.findIndex(n => n.id === id);
            if (index > -1)
                state.notifications.splice(index, 1);
        }),

        info$: $((message, options) => {
            state.notifications.push({
                id: cuid(),
                text: message,
                variant: 'info',
                ...options
            });
        }),

        success$: $((message, options) => {
            state.notifications.push({
                id: cuid(),
                text: message,
                variant: 'success',
                ...options
            });
        }),

        error$: $((error: unknown, options?: Partial<Notification>) => {
            console.log(error);
            state.notifications.push({
                id: cuid(),
                text: 'Shitballs! Something went wrong. Check the console for details.',
                variant: 'error',
                ...options
            })
        })
    });

    // Pass notification methods down through context
    useContextProvider(NotificationsContext, context);

    return (
        <>
            <Slot/>
            <div class="absolute right-0 bottom-0 p-4 w-96">
                {state.notifications.map(note => (
                    <NotificationComponent key={note.id} {...note}/>
                ))}
            </div>
        </>
    );
})