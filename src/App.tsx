import type { ReactNode } from 'react';
import './App.css';

export default function App({ children }: { children: ReactNode }) {
  return <div id="globalProviders">{children}</div>;
}
