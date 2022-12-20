import { Client } from "@urql/core";
import { createContext, NoSerialize, QRL } from "@builder.io/qwik";

export interface ApiState {
    clientQrl: QRL<() => NoSerialize<Client>>
}

export const ApiContext = createContext<ApiState>('api-context');
