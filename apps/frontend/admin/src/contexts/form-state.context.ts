import { createContext } from "@builder.io/qwik";
import { FormState } from "../hooks/use-form-state.hook";

export const FormStateContext = createContext<FormState>('form-state-context');