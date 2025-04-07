// src/app/page.tsx
'use client';

import React from 'react';
import DataTable from './components/DataTable';

export default function Home() {
  return (
    <main>
      <h1 className="text-xl font-bold">User Table</h1>
      <DataTable />
    </main>
  );
}
