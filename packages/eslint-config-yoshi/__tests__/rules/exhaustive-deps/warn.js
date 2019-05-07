/* eslint-disable no-unused-vars*/
import { useEffect } from 'react';

function Foo(props) {
  useEffect(() => {
    console.log(props.name);
  }, [props.notName]);
}
