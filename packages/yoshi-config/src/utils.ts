export type RequiredRecursively<T> = Exclude<
  T extends string | number | boolean | Function | RegExp
    ? T
    : {
        [P in keyof T]-?: T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : RequiredRecursively<T[P]>;
      },
  null | undefined
>;

export type AccessorFunction<T, R> = (object: RequiredRecursively<T>) => R;

export function getFrom<T>(object: T) {
  return function<R>(accessorFn: AccessorFunction<T, R>, defaultValue: R): R {
    try {
      const result = accessorFn((object as unknown) as RequiredRecursively<T>);
      return result === undefined || result === null ? defaultValue : result;
    } catch (e) {
      return defaultValue;
    }
  };
}
