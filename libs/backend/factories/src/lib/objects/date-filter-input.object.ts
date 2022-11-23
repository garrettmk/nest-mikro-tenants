import { BaseObject, DateConstraints, Property, optional } from "@garrettmk/class-schema";

export class DateFilterInput extends BaseObject implements DateConstraints {
    @Property(() => Date, { optional })
    min?: Date;

    @Property(() => Date, { optional })
    max?: Date;
}