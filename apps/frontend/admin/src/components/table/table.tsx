import { component$, JSXChildren, QRL } from "@builder.io/qwik";
import { identity } from '@garrettmk/ts-utils';
import clsx from "clsx";
import { get } from 'radash';

export interface TableColumn {
    label: string
    dataKey?: string
    format?: QRL<(value: unknown) => JSXChildren>
    classes?: string
}

export interface TableProps {
    class?: string
    columns: TableColumn[]
    items?: unknown[]
    identityKey?: string
}

export const Table = component$((props: TableProps) => {
    const {
        class: classNames,
        columns,
        items = [],
        identityKey = 'id'
    } = props;

    const render = async (item: unknown, column: TableColumn) => {
        const { format = identity, dataKey } = column;
        const value = dataKey ? get(item, dataKey) : item;

        return await format(value) as JSXChildren;
    }

    return (
        <table class={clsx("table-auto [&_td]:p-4 text-sm", classNames)}>
            <thead class="uppercase text-xs text-gray-600">
                <tr>
                    {columns.map(column => (
                        <td class={column.classes}>{column.label}</td>
                    ))}
                </tr>
            </thead>

            <tbody class="bg-white font-light">
                {items.map(item => (
                    <tr key={get(item, identityKey) as string} class="even:bg-slate-50">
                        {columns.map(column => (
                            <td key={column.dataKey ?? column.label} class={clsx("border-l first:border-l-0", column.classes)}>
                                {render(item, column)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
})