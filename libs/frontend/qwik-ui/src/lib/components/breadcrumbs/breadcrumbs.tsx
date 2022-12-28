import { Link } from "@builder.io/qwik-city";
import clsx from "clsx";

export interface BreadcrumbItem {
    text: string
    href: string
}

export interface BreadcrumbsProps {
    class?: string
    items: BreadcrumbItem[]
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
    const { class: classNames, items } = props;
    const lastIndex = items.length - 1;

    const styles = `
        flex items-center
        [&>:not(:last-child)]:mr-2
        text-gray-600
    `;

    return (
        <span class={clsx(styles, classNames)}>
            {items.map(({ text, href }, index) => (
                <>
                    <Link href={href} class="hover:underline decoration-dotted">
                        {text}
                    </Link>
                    {index === lastIndex && (
                        <span>
                            &gt;
                        </span>
                    )}
                </>
            ))}
        </span>
    );
};