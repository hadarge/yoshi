async function fAny() {
  const isAny: any = 1;

  // any type
  await isAny;

  // union type with any type
  await (Math.random() > 0.5 ? isAny : 0);
}
