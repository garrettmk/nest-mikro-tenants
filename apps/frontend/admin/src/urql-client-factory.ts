import { createClient, dedupExchange, errorExchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { qwikExchange, ClientFactory } from 'qwik-urql';


export const clientFactory: ClientFactory = ({ qwikStore }) => createClient({
    url: 'http://localhost:3334/graphql',
    exchanges: [
        qwikExchange({ cache: qwikStore }),
        dedupExchange,
        cacheExchange({
            keys: {
                Pagination: () => null,
                PaginatedUsers: () => null
            }
        }),
        fetchExchange
    ]
});