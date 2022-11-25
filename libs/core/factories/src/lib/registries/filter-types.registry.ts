import { BaseObjectConstructor, Float, getTypeInfo, Id, Int, PropertyMetadata } from '@garrettmk/class-schema';
import { MetadataSelector } from '@garrettmk/metadata-actions';
import { ClassMetadataDecoratorFn, MetadataManagerClass } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
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


const staticFilterMappings: [Constructor, FilterTypeMetadata][] = [
  [Boolean, { filterType: BooleanFilterInput }],
  [Date, { filterType: DateFilterInput }],
  [Float, { filterType: FloatFilterInput }],
  [Id, { filterType: IdFilterInput }],
  [Int, { filterType: IntFilterInput }],
  [Number, { filterType: NumberFilterInput }],
  [String, { filterType: StringFilterInput }],
];


export class FilterTypesRegistry extends MetadataManagerClass<FilterTypeMetadata, Constructor>(staticFilterMappings) {
  static getFilterType(target: Constructor) {
    const { filterType } = this.getMetadata(target);
    return filterType;
  }

  static setFilterType(target: Constructor, filterType: BaseObjectConstructor) {
    this.setMetadata(target, { filterType });
  }
}

export const FilterTypeMeta = ClassMetadataDecoratorFn(FilterTypesRegistry);

export const isFilterableField: MetadataSelector<PropertyMetadata> = (metadata) => {
  const { innerType } = getTypeInfo(metadata.type);

  return FilterTypesRegistry.hasMetadata(innerType as Constructor);
};
