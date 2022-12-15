import { BaseObjectActions, Class, Property, ValidationActions } from "@garrettmk/class-schema";
import { MatchesProperty } from "@nest-mikro-tenants/core/common";
import { UserCreateInput } from "@nest-mikro-tenants/core/domain";

@Class()
export class UserCreateFormData extends UserCreateInput {
    @MatchesProperty('password')
    @Property(() => String)
    passwordAgain!: string;
}

ValidationActions.applyActions(UserCreateFormData);
BaseObjectActions.applyActions(UserCreateFormData);