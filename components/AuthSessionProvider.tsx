'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

const AuthSessionProvider = ({ children, session }: { children: React.ReactNode, session: any }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;

};

export default AuthSessionProvider;


