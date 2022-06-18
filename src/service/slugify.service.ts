import { Utils } from './../utils/utils';
import { ISlugConfig } from '../config/slug.config';
import { Model, ModelClass } from 'objection';
import slugify from 'slugify';

export class SluggableService {

  constructor(private readonly config?: ISlugConfig) { }

  async create(baseModel: Model, slugPropName: string, propsNames: string[]): Promise<string> {
    if (!slugPropName)
      throw new Error("Name of prop slugable is empty.")
    let joined: string = Utils.concatObjProps(baseModel, ...propsNames);
    let slug: string = slugify(joined, this.config);
    return await this.makeUnique(baseModel.$modelClass, slugPropName, slug || Utils.randomString(this.config.lenghtSuffix));
  }

  private async makeUnique(modelClass: ModelClass<Model>, slugPropName: string, slug: string, uniqueId?: string) {
    let finalSlug = !uniqueId ? slug : `${slug}${this.config.replacement}${uniqueId}`
    let elem = await modelClass.query().where(slugPropName, finalSlug).first();
    console.log({ elem })
    if (!elem)
      return finalSlug;
    return await this.makeUnique(modelClass, slugPropName, slug, Utils.randomString(this.config.lenghtSuffix));
  }
}