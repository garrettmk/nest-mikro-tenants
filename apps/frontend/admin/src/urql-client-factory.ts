import { createClient } from '@urql/core';


export const clientFactory = () => createClient({
    url: 'http://localhost:3334/graphql',
});