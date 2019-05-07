/* eslint-disable no-unused-vars*/
import { useState, useEffect } from 'react';

function Form() {
  const [name, setName] = useState('Mary');

  if (name === '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
}
