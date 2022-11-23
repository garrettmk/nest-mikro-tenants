import { BaseObject, Property, StringConstraints, optional, Int } from "@garrettmk/class-schema";


export class StringFilterInput extends BaseObject implements StringConstraints {
    @Property(() => RegExp, { optional })
    matches?: RegExp;

    @Property(() => Int, { optional })
    minLength?: number;

    @Property(() => Int, { optional })
    maxLength?: number;

    @Property(() => [String], { optional })
    in?: string[];

    @Property(() => [String], { optional })
    nin?: string[];
}