import { ClassMetadataAction, ClassMetadataManager, PropertiesMetadataAction, PropertiesMetadataManager } from "@garrettmk/class-schema";
import { applyActions } from "@garrettmk/metadata-actions";
import { MetadataManagerClass } from "@garrettmk/metadata-manager";
import { Constructor, MaybeArray } from "@garrettmk/ts-utils";

export type DeferredActionsMetadata = {
    classActions?: MaybeArray<ClassMetadataAction>
    propertiesActions?: MaybeArray<PropertiesMetadataAction>
}

export class DeferredActionsRegistry extends MetadataManagerClass<DeferredActionsMetadata, Constructor>() {
    static getMetadata(target: Constructor): DeferredActionsMetadata {
        return this.metadatas.get(target) ?? {};
    }

    static runDeferredActions() {
        this.entries().forEach(([target, metadata]) => {
            const { classActions, propertiesActions } = metadata;
            const classMetadata = ClassMetadataManager.getMetadata(target);
            const propertiesMetadata = PropertiesMetadataManager.getMetadata(target);
            const context = { target };

            if (classActions) {
                const updatedClassMeta = applyActions(classMetadata, context, classActions);
                ClassMetadataManager.setMetadata(target, updatedClassMeta);
            }

            if (propertiesActions) {
                const updatedPropertiesMeta = applyActions(propertiesMetadata, context, propertiesActions);
                PropertiesMetadataManager.setMetadata(target, updatedPropertiesMeta);
            }
        });
    }
}