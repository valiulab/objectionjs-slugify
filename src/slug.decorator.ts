import { SluggableService } from './slugify.service';
import "reflect-metadata";
import { ReflectSlugProp } from "./constants/symbols";
import { SlugBaseConfig, ISlugConfig } from "./slug.config";
import { Model, QueryContext } from "objection";

export const Sluggable = (propsNames: string[], config?: ISlugConfig) => (target: Model, propertyKey: string) => {
    let finalConfig: ISlugConfig = {
        replacement: config?.replacement ?? SlugBaseConfig.replacement,
        remove: config?.remove ?? SlugBaseConfig.remove,
        lower: config?.lower ?? SlugBaseConfig.lower,
        strict: config?.strict ?? SlugBaseConfig.strict,
        locale: config?.locale ?? SlugBaseConfig.locale,
        edit: config?.edit ?? SlugBaseConfig.edit,
    };

    Reflect.defineMetadata(ReflectSlugProp, propertyKey, target);

    const insert = target.$beforeInsert;
    const update = target.$beforeUpdate;

    const sluggableService: SluggableService = new SluggableService(finalConfig);

    target.$beforeInsert = async function (queryContext: QueryContext) {
        await insert.apply(this, [queryContext]);
        const prop: string = Reflect.getMetadata(ReflectSlugProp, target);
        this[prop] = await sluggableService.create(this, prop, propsNames);
    }

    target.$beforeUpdate = async function (queryOptions, args: QueryContext) {
        await update.apply(this, [queryOptions, args]);
        if (finalConfig?.edit) {
            const prop: string = Reflect.getMetadata(ReflectSlugProp, target);
            this[prop] = await sluggableService.create(this, prop, propsNames);
        }
    }
}