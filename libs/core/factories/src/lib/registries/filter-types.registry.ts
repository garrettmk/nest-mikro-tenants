import { BaseObjectConstructor, CommonPropertyMetadata, Email, Float, getTypeInfo, Id, Int, TypeFn } from '@garrettmk/class-schema';
import { MetadataManagerClass } from '@garrettmk/metadata-manager';
import { BooleanFilterInput } from '../objects/boolean-filter-input.object';
import { DateFilterInput } from '../objects/date-filter-input.object';
import { FloatFilterInput } from '../objects/float-filter-input.object';
import { IdFilterInput } from '../objects/id-filter-input.object';
import { IntFilterInput } from '../objects/int-filter-input.object';
import { NumberFilterInput } from '../objects/number-filter-input';
import { StringFilterInput } from '../objects/string-filter-input.object';


export type FilterTypeMetadata = {
  filterType: BaseObjectConstructor;
};


const staticFilterMappings: [unknown, FilterTypeMetadata][] = [
  [Boolean, { filterType: BooleanFilterInput }],
  [Date, { filterType: DateFilterInput }],
  [Float, { filterType: FloatFilterInput }],
  [Id, { filterType: IdFilterInput }],
  [Int, { filterType: IntFilterInput }],
  [Number, { filterType: NumberFilterInput }],
  [String, { filterType: StringFilterInput }],
  [Email, { filterType: StringFilterInput }]
];


export class FilterTypesRegistry extends MetadataManagerClass<FilterTypeMetadata, unknown>(staticFilterMappings) {
  static getFilterType(target: unknown) {
    const { filterType } = this.getMetadata(target);
    return filterType;
  }

  static getFilterTypeFn(targetFn: TypeFn): TypeFn {
    return () => {
      const { innerType } = getTypeInfo(targetFn);
      return this.getFilterType(innerType);
    }
  }

  static setFilterType(target: unknown, filterType: BaseObjectConstructor) {
    this.setMetadata(target, { filterType });
  }

  static isFilterableField(metadata: CommonPropertyMetadata): boolean {
    const { innerType } = getTypeInfo(metadata.type);
    return Boolean(innerType && FilterTypesRegistry.hasMetadata(innerType));
  }
}

export function FiltersType(target: unknown): ClassDecorator {
  return function (filterType) {
    FilterTypesRegistry.setFilterType(target, filterType as unknown as BaseObjectConstructor);
  }
}
