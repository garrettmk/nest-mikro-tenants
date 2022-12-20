import { $, QRL, useContext, useSignal, useWatch$ } from "@builder.io/qwik";
import { BaseModel } from "@garrettmk/class-schema";
import { Constructor } from "@garrettmk/ts-utils";
import { CreateInput } from "@nest-mikro-tenants/core/factories";
import { createOneMutation, CreateOneVariables } from "@nest-mikro-tenants/frontend/common";
import { NotificationsContext } from "../components/notifications/notifications-provider";
import { useMutation } from "@nest-mikro-tenants/frontend/qwurql";


export function useCreateOneMutation<
    T extends BaseModel,
    C extends CreateInput<T>,
>(
    target: QRL<() => Constructor<T>>,
    createInput: QRL<() => Constructor<C>>,
    initialVars?: CreateOneVariables<T, C>
) {
    // Resolve the mutation and target name
    const targetName = useSignal<string>();
    const mutation$ = $(async () => {
        const [targetClass, createInputClass] = await Promise.all([
            target(),
            createInput()
        ]);

        targetName.value = targetClass.name;
        return createOneMutation(targetClass, createInputClass);
    });

    // Run the mutation hook
    const mutation = useMutation(mutation$, initialVars);

    // Auto report the result
    const { success$, error$ } = useContext(NotificationsContext);
    useWatch$(({ track }) => {
        const result = track(mutation.result);

        if (result.value?.error)
            error$(result.value.error);
        else if (result.value?.data)
            success$(`Excellent! ${targetName.value} created successfully`);
    });

    return mutation;
}