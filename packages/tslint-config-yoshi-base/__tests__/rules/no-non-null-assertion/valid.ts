function foo(instance: MyClass | undefined) {
  if (instance !== undefined) {
    instance.doWork();
  }
}
