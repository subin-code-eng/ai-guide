import { ReactNode } from 'react';

// Frontend-only build: no auth gating.
const ProtectedRoute = ({ children }: { children: ReactNode }) => <>{children}</>;

export default ProtectedRoute;
