import path from 'path';
import pathToRegexp from 'path-to-regexp';

export function relativeFilePath(from: string, to: string) {
  return path.relative(from, to.replace(/\.[^/.]+$/, ''));
}

export function get<T, P1 extends keyof NonNullable<T>>(
  obj: T,
  prop1: P1,
): NonNullable<T>[P1] | undefined;

export function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>
>(
  obj: T,
  prop1: P1,
  prop2: P2,
): NonNullable<NonNullable<T>[P1]>[P2] | undefined;

export function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>
>(
  obj: T,
  prop1: P1,
  prop2: P2,
  prop3: P3,
): NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3] | undefined;

export function get(obj: any, ...props: Array<string>): any {
  return (
    obj &&
    props.reduce(
      (result, prop) => (result == null ? undefined : result[prop]),
      obj,
    )
  );
}

export function pathMatch(route: string, pathname: string | undefined) {
  const keys: Array<any> = [];
  const regex = pathToRegexp(route, keys, {});

  const match = regex.exec(pathname as string);

  if (!match) {
    return false;
  }

  return keys.reduce((acc, key, index) => {
    const param = match[index + 1];

    if (!param) {
      return acc;
    }

    const value = decodeURIComponent(param);

    return {
      ...acc,
      [key.name]: key.repeat ? value.split(key.delimiter) : value,
    };
  }, {});
}
