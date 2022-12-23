import { useContext } from "@builder.io/qwik";
import { NotificationsContext } from "../components/notifications/notifications-provider";

export function useNotify() {
    return useContext(NotificationsContext);
}