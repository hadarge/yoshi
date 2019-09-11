import React from 'react';
import { HttpClient } from 'yoshi-server-client';
import { HttpContext } from './context';

export const HttpProvider: React.FC<{ client: HttpClient }> = ({
  children,
  client,
}) => {
  return (
    <HttpContext.Provider value={{ client }}>{children}</HttpContext.Provider>
  );
};
