import { BooleanConstraints, Property, optional, BaseObject } from "@garrettmk/class-schema";

export class BooleanFilterInput extends BaseObject implements BooleanConstraints {
    @Property(() => Boolean, { optional })
    eq?: boolean;

    @Property(() => Boolean, { optional })
    ne?: boolean;
}