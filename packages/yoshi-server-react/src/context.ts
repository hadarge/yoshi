import React from 'react';
import { HttpClient } from 'yoshi-server-client';

export const HttpContext: React.Context<{
  client?: HttpClient;
}> = React.createContext({});
