import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [name] = useState('Mary');

  if (name === '') {
    useEffect(() => {
      console.log('Effect');
    });
  }
};
