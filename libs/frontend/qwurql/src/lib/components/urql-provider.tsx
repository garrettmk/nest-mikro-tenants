import { $, component$, NoSerialize, noSerialize, Slot, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { Client, createClient, dedupExchange, fetchExchange, cacheExchange } from "@urql/core";
import { UrqlContext, UrqlContextState } from "../contexts/urql.context";

export const UrqlProvider = component$(() => {
    const client = useSignal<NoSerialize<Client>>()

    const clientQrl = $(() => {
        if (client.value)
            return client.value;

        client.value = noSerialize(
            createClient({
                url: 'http://localhost:3333/graphql',
                exchanges: [
                    dedupExchange,
                    cacheExchange,
                    fetchExchange
                ]
            })
        );

        return client.value;
    });

    const state = useStore<UrqlContextState>({
        clientQrl
    });

    useContextProvider(UrqlContext, state);

    return <Slot/>
})