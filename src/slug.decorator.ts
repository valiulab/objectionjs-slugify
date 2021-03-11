import "reflect-metadata";
import slugify from "slugify";
import { ReflectSlugProp, ReflectSlugConfig } from "./constants/symbols";
import { SlugBaseConfig, ISlugConfig } from "./slug.config";
import { v4 as uuidv4 } from 'uuid';
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

    Reflect.defineMetadata(ReflectSlugConfig, finalConfig, target);
    Reflect.defineMetadata(ReflectSlugProp, propertyKey, target);

    const insert = target.$beforeInsert;
    const update = target.$beforeUpdate;

    target.$beforeInsert = async function (queryContext: QueryContext) {
        await insert.apply(this, [queryContext]);

        const prop: string = Reflect.getMetadata(ReflectSlugProp, target);
        const config: ISlugConfig = Reflect.getMetadata(ReflectSlugConfig, target);

        let joinedProps: string = concatModelProps(this, ...propsNames);
        
        // CHECK IF IS REPETED

        this[prop] = slugify(joinedProps, config);
    }

    target.$beforeUpdate = async function (queryOptions, args: QueryContext) {
        await update.apply(this, [queryOptions, args]);

        const prop: string = Reflect.getMetadata(ReflectSlugProp, target);
        const config: ISlugConfig = Reflect.getMetadata(ReflectSlugConfig, target);

        if (finalConfig?.edit) {
            let joinedProps: string = concatModelProps(this, ...propsNames);

            // CHECK IF IS REPETED

            this[prop] = slugify(joinedProps, config);
        }
    }
}

const concatModelProps = (model: Record<string, any>, ...propsNames: string[]) => {
    let joinedProps: string = '';

    for (const propName of propsNames) {
        if (propName in model)
            joinedProps = `${joinedProps} ${model[propName]}`;
    }

    if (!joinedProps)
        joinedProps = uuidv4();
    
    return joinedProps;
}