import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { WhereInput } from "@nest-mikro-tenants/core/factories";
import { findManyQuery, FindManyVariables } from "@nest-mikro-tenants/frontend/common";
import { NotificationsContext } from "../components/notifications/notifications-provider";
import { useQuery } from "./use-query.hook";

export function useFindManyQuery<
    T extends BaseModel,
    W extends WhereInput<T>,
    V extends FindManyVariables<T, W> = FindManyVariables<T, W>
>(
    target: QRL<() => Constructor<T>>,
    whereInput: QRL<() => Constructor<W>>,
    variables?: Partial<V>
) {
    // Resolve the query and target name
    const targetName = useSignal<string>();
    const query$ = $(async () => {
        const [targetClass, whereInputClass] = await Promise.all([
            target(),
            whereInput()
        ]);

        targetName.value = targetClass.name;
        return findManyQuery(targetClass, whereInputClass);
    });

    // Run the query hook
    const [resource$, refetch$] = useQuery(query$, variables);

    // Auto report errors
    const { error$ } = useContext(NotificationsContext);
    useWatch$(({ track }) => {
        track(() => resource$.promise);

        resource$.promise.catch(error => error$(error));
    });

    return [resource$, refetch$] as const;
}