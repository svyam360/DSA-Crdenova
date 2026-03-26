export interface DashboardKPI {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

export interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  type: 'LEAD' | 'APPLICATION' | 'APPROVAL' | 'DISBURSEMENT';
  title: string;
  description: string;
  time: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface AdminDashboardData {
  kpis: DashboardKPI[];
  funnel: FunnelData[];
  recentActivity: RecentActivity[];
}

export const ADMIN_DASHBOARD_MOCK: AdminDashboardData = {
  kpis: [
    {
      label: 'Total Leads',
      value: '2,847',
      change: '+18.2%',
      changeType: 'increase',
      icon: '📋',
    },
    {
      label: 'Applications',
      value: '1,456',
      change: '+12.5%',
      changeType: 'increase',
      icon: '📄',
    },
    {
      label: 'Approved',
      value: '892',
      change: '+8.3%',
      changeType: 'increase',
      icon: '✅',
    },
    {
      label: 'Disbursed',
      value: '₹12.8 Cr',
      change: '+22.4%',
      changeType: 'increase',
      icon: '💰',
    },
  ],
  funnel: [
    { stage: 'Leads Generated', count: 2847, percentage: 100 },
    { stage: 'Logged In', count: 1456, percentage: 51 },
    { stage: 'Documents Verified', count: 1124, percentage: 39 },
    { stage: 'Approved', count: 892, percentage: 31 },
    { stage: 'Disbursed', count: 678, percentage: 24 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'LEAD',
      title: 'New lead from Mumbai',
      description: 'Rajesh Kumar · Home Loan · ₹45L',
      time: '2 mins ago',
      status: 'NEW',
    },
    {
      id: '2',
      type: 'APPLICATION',
      title: 'Application submitted',
      description: 'Priya Sharma · Personal Loan · ₹8L',
      time: '15 mins ago',
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      type: 'APPROVAL',
      title: 'Loan approved by HDFC',
      description: 'Amit Patel · Business Loan · ₹25L',
      time: '1 hour ago',
      status: 'COMPLETED',
    },
    {
      id: '4',
      type: 'DISBURSEMENT',
      title: 'Amount disbursed',
      description: 'Sneha Reddy · Car Loan · ₹12L',
      time: '2 hours ago',
      status: 'COMPLETED',
    },
    {
      id: '5',
      type: 'APPLICATION',
      title: 'Documents uploaded',
      description: 'Vikram Singh · Home Loan · ₹55L',
      time: '3 hours ago',
      status: 'IN_PROGRESS',
    },
  ],
};
