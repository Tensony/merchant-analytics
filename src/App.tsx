import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'// src/App.tsx
import { KPICard } from './components/ui/KPICard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Merchant Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value="$45,231.89" change={12.5} />
        <KPICard title="Transactions" value="2,345" change={8.2} />
        <KPICard title="Active Merchants" value="156" change={-2.4} />
        <KPICard title="Avg. Transaction" value="$19.29" change={3.1} />
      </div>
    </div>
  );
}

export default App;