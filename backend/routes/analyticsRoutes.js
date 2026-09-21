const express = require('express');
const { 
  getKpiOverview, 
  getComplaintTrend, 
  getComplaintsByCategory,
  getComplaintsByDepartment,
  getActiveAlerts,
  getTopRecurringIssues
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/kpi-overview', getKpiOverview);
router.get('/trends', getComplaintTrend);
router.get('/by-category', getComplaintsByCategory);
router.get('/by-department', getComplaintsByDepartment);
router.get('/alerts', getActiveAlerts);
router.get('/top-issues', getTopRecurringIssues);

module.exports = router;

