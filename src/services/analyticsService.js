/**
 * Analytics service (currently pending backend endpoints)
 * Returns empty structures until connected to backend API.
 */
export const analyticsService = {
  async getKpiOverview() {
    return {
      totalComplaints: { thisMonth: 0, thisYear: 0, change: 0 },
      avgResolutionTime: { hours: 0, days: 0, change: 0 },
      satisfactionScore: { percentage: 0, change: 0 },
      resolutionRate: { percentage: 0, change: 0 },
      openTickets: 0,
      mostReportedDept: '-',
    }
  },

  async getComplaintTrend(period = 'monthly') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      complaints: 0,
      resolved: 0,
    }))
  },

  async getComplaintsByCategory() {
    return []
  },

  async getComplaintsByDepartment() {
    return []
  },

  async getActiveAlerts() {
    return []
  },

  async getTopRecurringIssues() {
    return []
  },
}
