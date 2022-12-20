import { $, component$, Resource, useContext, useWatch$ } from "@builder.io/qwik";
import { User, UsersWhereOneInput } from "@nest-mikro-tenants/core/domain";
import { useDeleteOneMutation } from "../../hooks/use-delete-one-mutation.hook";
import { NotificationsContext } from "../notifications/notifications-provider";

export interface UserDeleteMutationProps {
    where: UsersWhereOneInput
}

export const UserDeleteMutation = component$((props: UserDeleteMutationProps) => {
    const { where } = props;
    const [resource$, mutate$] = useDeleteOneMutation(
        $(() => User),
        $(() => UsersWhereOneInput),
        { where }
    );

    useWatch$(() => mutate$());

    const { success$, error$ } = useContext(NotificationsContext);

    return (
        <Resource
            value={resource$}
            onResolved={result => { success$('yay'); return <></>; }}
            onRejected={reason => { error$(reason); return <></>; }}
        />
    )
})