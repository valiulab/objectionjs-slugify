export class Utils {
  static concatObjProps(model: Record<string, any>, ...propsNames: string[]): string {
    let joinedProps: string = '';
    for (const propName of propsNames) {
        if (propName in model)
            joinedProps = `${joinedProps} ${model[propName]}`;
    }
    return joinedProps.trim();
  }
}