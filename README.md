## Slugify

With this package you can easily turn a property from an ObjectionJS model into a sluggable. This package is based on [slugify](https://www.npmjs.com/package/slugify).

[ObjectionJS](https://vincit.github.io/objection.js/) is an ORM for Node.js that aims to stay out of your way and make it as easy as possible to use the full power of SQL and the underlying database engine while still making the common stuff easy and enjoyable.

## Installation

```bash

$ npm i -S objectionjs-slugify

```

## How to use

You only need put @Sluggable([...propsName]) above the property that will store the slug, indicating which properties to use to generate it.

```typescript
// This options are from slugify package, see more on the official documentation.
const SlugBaseConfig: ISlugConfig = {
  replacement: "-",
  remove: undefined,
  lower: true,
  strict: true,
  locale: "v1",
  edit: true,
};

class Person extends Model {
  static tableName = "persons";

  id!: number;

  firstname: string;
  lastname: string;

  @Sluggable(["firstname", "lastname"], SlugBaseConfig)
  slug?: string;
}
```

## Support

objectionjs-slugify is an MIT-licensed open source project. If you want to contribute something, you can generate a pull request and I will be reviewing it :)

## License

Objection-slugify - [LICENSE](https://github.com/ralcorta/objectionjs-slugify/blob/main/LICENSE "LICENSE")
