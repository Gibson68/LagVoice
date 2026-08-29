/**
 * Mock analytics service
 * Provides KPI data and chart data for the admin dashboard
 */

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const analyticsService = {
  async getKpiOverview() {
    await delay()
    return {
      totalComplaints: { thisMonth: 147, thisYear: 1823, change: 12.3 },
      avgResolutionTime: { hours: 48, days: 2, change: -8.5 },
      satisfactionScore: { percentage: 78.5, change: 3.2 },
      resolutionRate: { percentage: 82.1, change: 5.7 },
      openTickets: 34,
      mostReportedDept: 'Engineering',
    }
  },

  async getComplaintTrend(period = 'monthly') {
    await delay()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month, i) => ({
      month,
      complaints: Math.floor(100 + Math.random() * 100),
      resolved: Math.floor(80 + Math.random() * 80),
    }))
  },

  async getComplaintsByCategory() {
    await delay()
    return [
      { category: 'Academic & Teaching', count: 312 },
      { category: 'Infrastructure', count: 478 },
      { category: 'Administrative', count: 267 },
      { category: 'Student Welfare', count: 189 },
      { category: 'General', count: 89 },
    ]
  },

  async getComplaintsByDepartment() {
    await delay()
    return [
      { department: 'Engineering', count: 245 },
      { department: 'Science', count: 198 },
      { department: 'Arts', count: 156 },
      { department: 'Social Sciences', count: 134 },
      { department: 'Management Sciences', count: 112 },
      { department: 'Law', count: 89 },
      { department: 'Education', count: 78 },
      { department: 'Medicine', count: 67 },
    ]
  },

  async getActiveAlerts() {
    await delay()
    return [
      {
        id: 1,
        severity: 'critical',
        title: 'Spike in complaints: Hostel 4',
        message: '12 complaints received in the last 24 hours regarding water supply in Hall 4',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: false,
      },
      {
        id: 2,
        severity: 'warning',
        title: 'Below average resolution time',
        message: 'Department of Chemistry has a 72-hour average resolution time (target: 48h)',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        acknowledged: false,
      },
    ]
  },

  async getTopRecurringIssues() {
    await delay()
    return [
      { issue: 'Water supply outages in halls', count: 34, trend: 'increasing' },
      { issue: 'Student portal downtime', count: 28, trend: 'stable' },
      { issue: 'Broken AC in lecture halls', count: 23, trend: 'decreasing' },
      { issue: 'Slow registration process', count: 19, trend: 'increasing' },
      { issue: 'Cafeteria food quality', count: 15, trend: 'stable' },
    ]
  },
}
