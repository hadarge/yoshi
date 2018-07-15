class B {
  foo() {
    return 'bar';
  }
}

class A extends B {
  constructor() {
    super();
    super();
  }

  hello() {
    return 'world';
  }
}
