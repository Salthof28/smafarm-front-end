import React, { Suspense } from 'react';
import LoginClient from './loginClient';


export default function PageLogin() {
  const initialLoading: boolean = false
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient initialLoading={initialLoading} />
    </Suspense>
  );
}