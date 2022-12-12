import { component$, JSXChildren, QRL } from "@builder.io/qwik";
import { identity } from '@garrettmk/ts-utils';
import clsx from "clsx";
import { get } from 'radash';

export interface TableColumn {
    label: string
    dataKey: string
    format?: QRL<(value: unknown) => JSXChildren>
}

export interface TableProps {
    class?: string
    columns: TableColumn[]
    items?: any[]
}

export const Table = component$((props: TableProps) => {
    const { class: classNames, columns, items = [] } = props;

    const render = async (item: unknown, column: TableColumn) => {
        const { format = identity, dataKey } = column;
        const value = get(item, dataKey);

        return await format(value) as JSXChildren;
    }

    return (
        <table class={clsx("table-auto [&_td]:p-4 text-sm", classNames)}>
            <thead class="uppercase text-xs">
                <tr>
                    {columns.map(column => (
                        <td>{column.label}</td>
                    ))}
                </tr>
            </thead>

            <tbody class="bg-white font-light">
                {items.map(item => (
                    <tr class="even:bg-slate-50">
                        {columns.map(column => (
                            <td class="border-l first:border-l-0">
                                {render(item, column)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
})