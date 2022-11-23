import { BaseObject, Int, NumberConstraints, Property, optional } from "@garrettmk/class-schema";

export class IntFilterInput extends BaseObject implements NumberConstraints {
    @Property(() => Int, { optional })
    min?: number;

    @Property(() => Int, { optional })
    max?: number;

    @Property(() => Int, { optional })
    eq?: number;

    @Property(() => Int, { optional })
    ne?: number;

    @Property(() => [Int], { optional })
    in?: number[];

    @Property(() => [Int], { optional })
    nin?: number[]
}