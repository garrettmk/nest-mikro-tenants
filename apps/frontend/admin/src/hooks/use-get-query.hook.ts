import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { getQuery } from "@nest-mikro-tenants/frontend/common";
import { useQueryResource } from "@nest-mikro-tenants/frontend/qwurql";
import { NotificationsContext } from "../components/notifications/notifications-provider";

export function useGetQueryResource<T extends BaseModel>(target: QRL<() => Constructor<T>>, variables: { id: string }) {
    // Resolve the query and target name
    const targetName = useSignal<string>();
    const query$ = $(async () => {
        const targetClass = await target();
        targetName.value = targetClass.name;

        return getQuery(targetClass);
    });

    // Run the query hook
    const query = useQueryResource(query$, variables);

    // Auto report errors
    const { error$ } = useContext(NotificationsContext);
    useWatch$(({ track }) => {
        const promise = track(() => query.resource$.promise);
        promise.catch(error$);
    });

    return query;
}