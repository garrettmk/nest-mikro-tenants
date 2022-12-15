import { HTMLAttributes } from '@builder.io/qwik';
import clsx from 'clsx';

export type PageHeaderProps = HTMLAttributes<HTMLDivElement>;

export const PageHeader = (props: PageHeaderProps) => {
    const { class: classNames, ...headerProps } = props;

    return (
        <header 
            class={clsx("-mx-4 -mt-4 p-4 mb-4 bg-slate-200 flex items-center", classNames)} 
            {...headerProps}
        />
    );
};
