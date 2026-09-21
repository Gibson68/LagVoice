const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getKpiOverview = async (req, res, next) => {
  try {
    const totalComplaints = await prisma.ticket.count();
    const resolvedComplaints = await prisma.ticket.count({ where: { status: 'resolved' } });
    const openComplaints = await prisma.ticket.count({ 
      where: { status: { in: ['pending', 'under_review'] } } 
    });

    const categories = await prisma.ticket.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 1
    });
    const mostReportedDept = categories.length > 0 ? categories[0].category : 'N/A';

    res.status(200).json({
      success: true,
      data: {
        totalComplaints: { thisMonth: totalComplaints, thisYear: totalComplaints, change: 0 },
        avgResolutionTime: { hours: 48, days: 2, change: 0 }, 
        satisfactionScore: { percentage: 80, change: 0 },
        resolutionRate: { 
          percentage: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0, 
          change: 0 
        },
        openTickets: openComplaints,
        mostReportedDept,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintTrend = async (req, res, next) => {
  try {
    // Generate real trends based on DB
    const tickets = await prisma.ticket.findMany({
      select: { createdAt: true, status: true }
    });
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = months.map(month => ({ month, complaints: 0, resolved: 0 }));

    tickets.forEach(ticket => {
      const monthIdx = new Date(ticket.createdAt).getMonth();
      trendData[monthIdx].complaints += 1;
      if (ticket.status === 'resolved') {
        trendData[monthIdx].resolved += 1;
      }
    });

    res.status(200).json({ success: true, data: trendData });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintsByCategory = async (req, res, next) => {
  try {
    const categories = await prisma.ticket.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    const data = categories.map(c => ({
      category: c.category || 'Unknown',
      count: c._count.category
    }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintsByDepartment = async (req, res, next) => {
  try {
    // In our schema, we don't have department directly, we'll group by category
    const categories = await prisma.ticket.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    const resolved = await prisma.ticket.groupBy({
      by: ['category'],
      where: { status: 'resolved' },
      _count: { category: true }
    });

    const resolvedMap = {};
    resolved.forEach(r => { resolvedMap[r.category] = r._count.category });

    const data = categories.map(c => ({
      department: c.category || 'Unknown',
      count: c._count.category,
      resolved: resolvedMap[c.category] || 0
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getActiveAlerts = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopRecurringIssues = async (req, res, next) => {
  try {
    const subcategories = await prisma.ticket.groupBy({
      by: ['subcategory'],
      _count: { subcategory: true },
      orderBy: { _count: { subcategory: 'desc' } },
      take: 5
    });
    const data = subcategories.map(s => ({
      issue: s.subcategory || 'General',
      count: s._count.subcategory,
      trend: 'increasing'
    }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
