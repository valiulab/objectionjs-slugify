export interface ISlugConfig {
    replacement: string,  // replace spaces with replacement character, defaults to `-`
    remove: RegExp, // remove characters that match regex, defaults to `undefined`
    lower: boolean,      // convert to lower case, defaults to `false`
    strict: boolean,     // strip special characters except replacement, defaults to `false`
    locale: string,       // language code of the locale to use
    edit: boolean,
}

export const SlugBaseConfig = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'v1',
    edit: true,
}