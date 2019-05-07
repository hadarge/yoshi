/* eslint-disable no-unused-vars*/
import { useState, useEffect } from 'react';

function Form() {
  const [name] = useState('Mary');

  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });
}
