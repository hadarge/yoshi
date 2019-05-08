import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [name] = useState('Mary');

  useEffect(() => {
    console.log('Effect');
  });
};
