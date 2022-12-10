import { component$, PropFunction, useStore, useWatch$ } from '@builder.io/qwik';
import { BaseObjectConstructor, getTypeInfo, PropertiesMetadata, TypeFn } from '@garrettmk/class-schema';
import { Constructor } from '@garrettmk/ts-utils';

export interface ClassMetadataViewProps {
    type?: PropFunction<TypeFn<BaseObjectConstructor>>
}

interface ClassMetadataViewState {
    name?: string
    description?: string
    properties?: PropertiesMetadata
}

export const YesNo = ({ value }: { value: unknown }) => (
    <span>{value ? 'Yes' : 'No'}</span>
)

export const ClassMetadataView = component$((props: ClassMetadataViewProps) => {
    const state = useStore<ClassMetadataViewState>({
        name: '',
        description: '',
        properties: {}
    });

    useWatch$(async ({ track }) => {
        track(() => props.type);
        if (!props.type)
            return;

        const ctor = await props.type();
        state.name = ctor.name;
        state.description = ctor.getClassMetadata().description;
        state.properties = serializeProperties(ctor.getPropertiesMetadata());
    });

    return (
        <div class="bg-slate-200 inline-block rounded-lg overflow-hidden drop-shadow-sm">
            <div class="text-lg tracking-wide p-4">
                <span class="block text-xl tracking-wide">
                    {state.name}
                </span>
                <span class="text-sm font-light">
                    {state.description}
                </span>
            </div>
            <table class="table-auto [&_td]:p-4 text-sm">
                <thead class="uppercase">
                    <tr>
                        <td>Property</td>
                        <td>Type</td>
                        <td>Optional?</td>
                        <td>Unique?</td>
                    </tr>
                </thead>
                <tbody class="bg-white font-light">
                    {Object.entries(state.properties ?? {}).map(([propertyKey, propertyMeta]) => (
                        <tr>
                            <td>{propertyKey}</td>
                            <td>{propertyMeta.type}</td>
                            <td><YesNo value={propertyMeta.optional}/></td>
                            <td><YesNo value={propertyMeta.unique}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default ClassMetadataView;


export function serializeProperties(properties: PropertiesMetadata): PropertiesMetadata {
    const result = JSON.parse(JSON.stringify(properties));
    Object.entries(result).forEach(([key, meta]) => {
        result[key]['type'] = serializeTypeName(properties[key].type);
    });
    return result;
}

function serializeTypeName(typeFn: TypeFn): string {
    const { innerType, isArray, isConstructor, isEnum } = getTypeInfo(typeFn);
    const baseName = 
        isConstructor ? (innerType as Constructor).name :
        isEnum ? 'Enum' :
        '' + innerType;

    return isArray ? `${baseName}[]` : baseName;

}