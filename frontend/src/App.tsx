import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Packages } from './pages/Packages';
import { PackageDetail } from './pages/PackageDetail';
import { PackageSettings } from './pages/PackageSettings';
import { Builds } from './pages/Builds';
import { BuildDetail } from './pages/BuildDetail';
import { Activity } from './pages/Activity';
import { ConfigFiles } from './pages/ConfigFiles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/package/:id/settings" element={<PackageSettings />} />
            <Route path="/package/:id/config-files" element={<ConfigFiles />} />
            <Route path="/builds" element={<Builds />} />
            <Route path="/build/:id" element={<BuildDetail />} />
            <Route path="/activities" element={<Activity />} />
            <Route path="/config-files" element={<ConfigFiles />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1B1F26',
            color: '#e5e7eb',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: '"DM Sans", system-ui, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#6bab58',
              secondary: '#1B1F26',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4752',
              secondary: '#1B1F26',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
