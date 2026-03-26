import { AdminDashboardData, ADMIN_DASHBOARD_MOCK } from './dashboardMockData';

export const dashboardService = {
  // TODO: Replace with real API call
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return ADMIN_DASHBOARD_MOCK;
  },
};
