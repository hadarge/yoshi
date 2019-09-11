import { isEqual } from 'lodash';
import {
  FunctionArgs,
  FunctionResult,
  UnpackPromise,
  DSL,
  OptionalPromise,
} from 'yoshi-server/types';
import { HttpClient } from 'yoshi-server-client';

type Mock<Result extends FunctionResult, Args extends FunctionArgs> = {
  request: {
    fn: DSL<Result, Args>;
    variables: Args;
  };
  result: () => OptionalPromise<Result>;
};

export default class implements HttpClient {
  private mocks: Array<Mock<any, any>>;

  constructor(mocks: Array<Mock<any, any>>) {
    this.mocks = mocks;
  }

  async request<Result extends FunctionResult, Args extends FunctionArgs>(
    dsl: DSL<Result, Args>,
    ...args: Args
  ): Promise<UnpackPromise<Result>> {
    const mock = this.mocks.find(({ request }) => {
      if (request.fn === dsl) {
        return isEqual(args, request.variables);
      }
    });

    if (mock) {
      return mock.result();
    }

    throw new Error('not found');
  }
}
