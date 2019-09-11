import {
  FunctionResult,
  FunctionArgs,
  ServerFunction,
  RouteFunction,
  DSL,
} from './types';

export function fn<Result extends FunctionResult, Args extends FunctionArgs>(
  _fn_: ServerFunction<Result, Args>,
): DSL<Result, Args> {
  // Explain that this is done in build-time
  return { fileName: '', functionName: '', __fn__: _fn_ };
}

export function route<Result extends FunctionResult>(
  _route_: RouteFunction<Result>,
): RouteFunction<Result> {
  return _route_;
}

export function dsl(_dsl_: {
  fileName: string;
  functionName: string;
}): DSL<any, any> {
  return _dsl_ as DSL<any, any>;
}
