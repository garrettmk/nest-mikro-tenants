import { Class, Property } from "@garrettmk/class-schema";
import { ValidationActions } from "@nest-mikro-tenants/core/actions";
import { MatchesProperty } from "@nest-mikro-tenants/core/common";
import { UserCreateInput } from "@nest-mikro-tenants/core/domain";

@Class()
export class UserCreateFormData extends UserCreateInput {
    @MatchesProperty('password')
    @Property(() => String)
    passwordAgain!: string;
}

ValidationActions.applyActions(UserCreateFormData);