import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import AdminDashboardPage from '../pages/admin/AdminDashBoard';
import LeadsPage from '../pages/admin/LeadsPage';
import RoleDashboardPage from '../pages/shared/RoleDashboardPage';
import ApplicationsPage from '../pages/admin/ApplicationsPage';
import EligibilityPage from '../pages/admin/EligibilityPage';
import DocumentsPage from '../pages/admin/DocumentsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import DsaManagementPage from '../pages/admin/DsaManagementPage';
import CommissionsPage from '../pages/admin/CommissionsPage';
import SettingsPage from '../pages/admin/SettingsPage';
import MyAgentsPage from '../pages/dsa/MyAgentsPage';
import EarningsPage from '../pages/shared/EarningsPage';
import RateCardSlaPage from '../pages/admin/RateCardSlaPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Dashboard">
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Leads">
            <AppLayout>
              <LeadsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Applications">
            <AppLayout>
              <ApplicationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/eligibility"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Eligibility">
            <AppLayout>
              <EligibilityPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/documents"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Documents">
            <AppLayout>
              <DocumentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dsas"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="DSA Management">
            <AppLayout>
              <DsaManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/commissions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Commissions">
            <AppLayout>
              <CommissionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Reports">
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/rate-cards"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Rate Cards & SLA">
            <AppLayout>
              <RateCardSlaPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Audit Logs">
            <AppLayout>
              <AuditLogsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} requiredScreen="Settings">
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Dashboard">
            <AppLayout>
              <RoleDashboardPage role="DSA" title="DSA Dashboard" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/leads"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Leads">
            <AppLayout>
              <LeadsPage
                roleScope="DSA"
                pageTitle="My Leads"
                pageSubtitle="View and update leads assigned to your DSA"
                allowCreate={false}
              />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/agents"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Agents">
            <AppLayout>
              <MyAgentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/applications"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Applications">
            <AppLayout>
              <ApplicationsPage roleScope="DSA" title="My Applications" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/reports"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Reports">
            <AppLayout>
              <ReportsPage roleScope="DSA" title="DSA Reports" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa/commissions"
        element={
          <ProtectedRoute allowedRoles={['DSA']} requiredScreen="Earnings">
            <AppLayout>
              <EarningsPage role="DSA" ownerName="Prime DSA" title="My Earnings" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['AGENT']} requiredScreen="Dashboard">
            <AppLayout>
              <RoleDashboardPage role="AGENT" title="Agent Dashboard" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/leads"
        element={
          <ProtectedRoute allowedRoles={['AGENT']} requiredScreen="Leads">
            <AppLayout>
              <LeadsPage
                roleScope="AGENT"
                pageTitle="My Leads"
                pageSubtitle="Track your daily lead activities and status updates"
                allowCreate={false}
              />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/applications"
        element={
          <ProtectedRoute allowedRoles={['AGENT']} requiredScreen="Applications">
            <AppLayout>
              <ApplicationsPage roleScope="AGENT" title="My Applications" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/earnings"
        element={
          <ProtectedRoute allowedRoles={['AGENT']} requiredScreen="Earnings">
            <AppLayout>
              <EarningsPage role="AGENT" ownerName="Field Agent Kumar" title="My Earnings" />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
