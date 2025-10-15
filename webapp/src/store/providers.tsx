'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

// Create store once per client bundle. For Next.js App Router, a simple singleton is OK for basic client state.
// If you need per-request isolation (SSR with server components reading state) you would adapt this pattern.
const store = makeStore();

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
