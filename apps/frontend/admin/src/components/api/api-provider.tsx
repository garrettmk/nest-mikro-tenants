import { $, component$, NoSerialize, noSerialize, Slot, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { Client, createClient, dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from '@urql/exchange-graphcache';
import { ApiContext, ApiState } from "../../contexts/api.context";

export const ApiProvider = component$(() => {
    const client = useSignal<NoSerialize<Client>>()

    const clientQrl = $(() => {
        if (client.value)
            return client.value;

        client.value = noSerialize(
            createClient({
                url: 'http://localhost:3334/graphql',
                exchanges: [
                    dedupExchange,
                    cacheExchange({
                        keys: {
                            Pagination: () => null,
                            PaginatedUsers: () => null
                        }
                    }),
                    fetchExchange
                ]
            })
        );

        return client.value;
    });

    const state = useStore<ApiState>({
        clientQrl
    });

    useContextProvider(ApiContext, state);

    return <Slot/>
})