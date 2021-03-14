import { ISlugConfig } from './slug.config';
import { Model } from 'objection';
import slugify from 'slugify';
import { Utils } from './utils';
import { v4 as uuidv4 } from 'uuid';

export class SluggableService {

  constructor(private readonly config?: ISlugConfig) { }
  
  async create(modelClass: Model, slugPropName: string, propsNames: string[]): Promise<string> {
    let joinedProps: string = Utils.concatObjProps(modelClass, ...propsNames);
    let slug: string = slugify(joinedProps, this.config);
    return this.makeUnique(modelClass, slugPropName, slug);
  }

  private async makeUnique(modelClass: Model, slugPropName, slug) {
    let finalSlug: string = slug;
    const elem = await modelClass.$modelClass.query().where(slugPropName, slug).first();
    if (elem) {
      const uuid: string = uuidv4();
      finalSlug += finalSlug ? `${this.config?.replacement}${uuid}` : uuid;
    }
    return finalSlug;
  }

}