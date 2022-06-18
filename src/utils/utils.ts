export class Utils {
  static concatObjProps(model: Record<string, any>, ...propsNames: string[]): string {
    let joinedProps: string = '';
    for (const propName of propsNames) {
      if (propName in model)
        joinedProps = `${joinedProps} ${model[propName]}`;
    }
    return joinedProps.trim();
  }

  static randomString(len = 20, charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
    let randomString = '';
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }
}