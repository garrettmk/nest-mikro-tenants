import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { deleteOneMutation, DeleteOneVariables } from "@nest-mikro-tenants/frontend/common";
import { NotificationsContext } from "../components/notifications/notifications-provider";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";

export function useDeleteOneMutation<
    T extends BaseModel,
    W extends WhereOneInput<T>
>(
    target: QRL<() => Constructor<T>>,
    whereInput: QRL<() => Constructor<W>>,
    initialVars?: Partial<DeleteOneVariables<T, W>>
) {
    // Resolve the mutation and target name
    const targetName = useSignal<string>();
    const mutation$ = $(async () => {
        const [targetClass, whereInputClass ] = await Promise.all([
            target(),
            whereInput(),
        ]);

        targetName.value = targetClass.name;
        return deleteOneMutation(targetClass, whereInputClass);
    });

    // Run the mutation hook
    const mutation = useMutation(mutation$, initialVars);

    // Auto report success or error
    const { success$, error$ } = useContext(NotificationsContext);
    useWatch$(({ track }) => {
        const result = track(mutation.result);

        if (result.value?.error)
            error$(result.value.error);
        else if (result.value?.data)
            success$(`${targetName.value} deleted successfully`);
    });

    return mutation;
}