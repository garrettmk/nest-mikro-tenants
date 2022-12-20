import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { getQuery } from "@nest-mikro-tenants/frontend/common";
import { NotificationsContext } from "../components/notifications/notifications-provider";
import { useQuery } from "./use-query.hook";

export function useGetQuery<T extends BaseModel>(target: QRL<() => Constructor<T>>, variables: { id: string }) {
    // Resolve the query and target name
    const targetName = useSignal<string>();
    const query$ = $(async () => {
        const targetClass = await target();
        targetName.value = targetClass.name;

        return getQuery(targetClass);
    });

    // Run the query hook
    const [resource$, refetch$] = useQuery(query$, variables);

    // Auto report errors
    const { error$ } = useContext(NotificationsContext);
    useWatch$(({ track }) => {
        const promise = track(() => resource$.promise);
        promise.catch(error$);
    });

    return [resource$, refetch$] as const;
}