import { Class, Property, optional } from "@garrettmk/class-schema";
import { ValidationActions } from "@nest-mikro-tenants/core/actions";
import { MatchesProperty } from "@nest-mikro-tenants/core/common";
import { UserUpdateInput } from "@nest-mikro-tenants/core/domain";

@Class()
export class UserUpdateFormData extends UserUpdateInput {
    @MatchesProperty('password')
    @Property(() => String, { optional })
    passwordAgain?: string;
}

ValidationActions.applyActions(UserUpdateFormData);