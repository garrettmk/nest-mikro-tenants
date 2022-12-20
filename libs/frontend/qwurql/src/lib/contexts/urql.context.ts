import { Client } from "@urql/core";
import { createContext, NoSerialize, QRL } from "@builder.io/qwik";

export interface UrqlContextState {
    clientQrl: QRL<() => NoSerialize<Client>>
}

export const UrqlContext = createContext<UrqlContextState>('urql-context');
