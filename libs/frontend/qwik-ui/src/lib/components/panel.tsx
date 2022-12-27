import { component$, useSignal, useStyles$ } from "@builder.io/qwik"
import { Serializable } from "@nest-mikro-tenants/core/common";
import { useMeasure } from "../hooks/use-measure"

export const cut = 25;

export const styles = `
    .panel {
        --path: 0 0, 100% 0, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 0 100%;
        
        clip-path: polygon(var(--path));
    }

    .panel-inner {
        position: absolute;
        inset: 5px;
        clip-path: polygon(var(--path));
    }
`

export const Panel = component$(() => {
    useStyles$(styles);
    const ref = useSignal<HTMLDivElement>();
    const rect = useMeasure(ref);
    const bevel = 25;
    const inset = 5;

    const path = `
        M 0 0
        L ${rect.width} 0
        L ${rect.width} ${rect.height - bevel}
        L ${rect.width - bevel} ${rect.height}
        L 0 ${rect.height}  
        L 0 ${rect.height - bevel }
        L ${inset} ${rect.height - bevel - inset}
        L ${inset} ${bevel + inset}
        L 0 ${bevel}
        L 0 0
    `;

    const path2 = `
        M 0 0
        L ${rect.width} 0
        L ${rect.width} ${rect.height - bevel}
        L ${rect.width - bevel} ${rect.height}
        L ${inset} ${rect.height}
        L ${inset} ${bevel + inset}
        L 0 ${bevel}
        L 0 0
    `;

    return (
        <div ref={ref} class="panel relative w-40 h-40 bg-slate-500">
            <div class="panel-inner bg-slate-300"/>
            {/* <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="absolute inset-0" 
                width="100%" 
                height="100%"
                viewbox={toViewbox(rect)}
            >
                <path
                    d={path2} 
                    fill="transparent" 
                    stroke="black"
                />
            </svg> */}
        </div>
    );
})


export function toViewbox(rect: Serializable<DOMRect>): string {
    return `${rect.x} ${rect.y} ${rect.width} ${rect.height}`;
}