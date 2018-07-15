class B {
  foo() {
    return 'bar';
  }
}

class A extends B {
  constructor() {
    super();
  }

  hello() {
    return 'world';
  }
}
