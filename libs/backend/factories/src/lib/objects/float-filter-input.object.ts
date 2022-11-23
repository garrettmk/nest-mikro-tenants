import { BaseObject, Float, NumberConstraints, Property, optional } from "@garrettmk/class-schema";

export class IntFilterInput extends BaseObject implements NumberConstraints {
    @Property(() => Float, { optional })
    min?: number;

    @Property(() => Float, { optional })
    max?: number;

    @Property(() => Float, { optional })
    eq?: number;

    @Property(() => Float, { optional })
    ne?: number;

    @Property(() => [Float], { optional })
    in?: number[];

    @Property(() => [Float], { optional })
    nin?: number[]
}