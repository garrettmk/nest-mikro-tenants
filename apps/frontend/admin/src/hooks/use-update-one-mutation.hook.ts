import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { UpdateInput, WhereOneInput } from "@nest-mikro-tenants/core/factories";
import { updateOneMutation, UpdateOneVariables } from "@nest-mikro-tenants/frontend/common";
import { NotificationsContext } from "../components/notifications/notifications-provider";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";


export function useUpdateOneMutation<
    T extends BaseModel,
    W extends WhereOneInput<T>,
    U extends UpdateInput<T>,
>(
    target: QRL<() => Constructor<T>>,
    whereInput: QRL<() => Constructor<W>>,
    updateInput: QRL<() => Constructor<U>>,
    initialVars?: Partial<UpdateOneVariables<T, W, U>>
) {
    // Resolve the mutation and target name
    const targetName = useSignal<string>();
    const mutation$ = $(async () => {
        const [targetClass, whereInputClass, updateInputClass] = await Promise.all([
            target(),
            whereInput(),
            updateInput()
        ]);

        targetName.value = targetClass.name;
        return updateOneMutation(targetClass, whereInputClass, updateInputClass);
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
            success$(`${targetName.value} updated successfully`);
    });

    return mutation;
}