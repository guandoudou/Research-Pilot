import React, { useState } from 'react';
import { Layout, View, Role } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KnowledgeBase } from './components/KnowledgeBase';
import { FormulationLab } from './components/FormulationLab';
import { SecurityAudit } from './components/SecurityAudit';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('Senior Expert');

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      currentRole={currentRole}
      onRoleChange={setCurrentRole}
    >
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'knowledge' && <KnowledgeBase key={currentRole} role={currentRole} />}
      {currentView === 'formulation' && <FormulationLab key={currentRole} role={currentRole} />}
      {currentView === 'security' && <SecurityAudit />}
    </Layout>
  );
}
