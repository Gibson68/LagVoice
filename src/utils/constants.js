/**
 * LagVoice Constants
 * Central configuration for the UNILAG Quality Assurance Ecosystem
 */

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  STUDENT_DASHBOARD: '/student',
  ADMIN_DASHBOARD: '/admin',
  FACULTY_DASHBOARD: '/faculty',
  EXTERNAL_DASHBOARD: '/external',
  FEEDBACK_SUBMIT: '/student/feedback',
  TICKET_DETAIL: '/student/ticket/:id',
  TICKETS_LIST: '/student/tickets',
  EVALUATION_FORM: '/student/evaluation/:courseId',
  EVALUATIONS_LIST: '/student/evaluations',
}

// User roles
export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
  EXTERNAL: 'external',
}

// Feedback categories with icons and colors
export const FEEDBACK_CATEGORIES = [
  {
    id: 'academic',
    label: 'Academic & Teaching',
    color: '#1266f1',
    icon: 'BookOpen',
    subcategories: [
      'Teaching Quality',
      'Course Content',
      'Assessment Methods',
      'Lecturer Availability',
      'Laboratory Sessions',
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure & Facilities',
    color: '#ffa900',
    icon: 'Building2',
    subcategories: [
      'Hostel',
      'Lecture Hall',
      'Laboratory',
      'Water Facility',
      'Electricity',
      'Toilet/Sanitation',
      'Campus Grounds',
    ],
  },
  {
    id: 'administrative',
    label: 'Administrative & Portal',
    color: '#0e52c1',
    icon: 'FileText',
    subcategories: [
      'Student Portal',
      'Registration Issues',
      'Result Processing',
      'Payment/Billing',
      'Documentation',
    ],
  },
  {
    id: 'welfare',
    label: 'Student Welfare & Safety',
    color: '#b23cfd',
    icon: 'Shield',
    subcategories: [
      'Security Concerns',
      'Health Services',
      'Counseling',
      'Food Services',
      'Transportation',
    ],
  },
  {
    id: 'general',
    label: 'General Feedback',
    color: '#00b74a',
    icon: 'MessageCircle',
    subcategories: [
      'Positive Feedback',
      'Suggestions',
      'Events',
      'General Inquiry',
    ],
  },
]

// Ticket statuses
export const TICKET_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ACTION_TAKEN: 'action_taken',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
  CLOSED: 'closed',
}

export const TICKET_STATUS_CONFIG = {
  [TICKET_STATUS.PENDING]: { label: 'Pending', color: '#ED6C02', bgColor: '#FFF3E0' },
  [TICKET_STATUS.UNDER_REVIEW]: { label: 'Under Review', color: '#1976D2', bgColor: '#E3F2FD' },
  [TICKET_STATUS.ACTION_TAKEN]: { label: 'Action Taken', color: '#7B1FA2', bgColor: '#F3E5F5' },
  [TICKET_STATUS.RESOLVED]: { label: 'Resolved', color: '#2E7D32', bgColor: '#E8F5E9' },
  [TICKET_STATUS.ESCALATED]: { label: 'Escalated', color: '#D32F2F', bgColor: '#FFEBEE' },
  [TICKET_STATUS.CLOSED]: { label: 'Closed', color: '#5A5A5A', bgColor: '#F5F5F5' },
}

// Urgency levels
export const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: '#2E7D32', description: 'Minor issue, not urgent' },
  { id: 'medium', label: 'Medium', color: '#ED6C02', description: 'Needs attention soon' },
  { id: 'high', label: 'High', color: '#D32F2F', description: 'Urgent, needs immediate attention' },
]

// Evaluation rating labels
export const RATING_LABELS = [
  'Poor',
  'Fair',
  'Good',
  'Very Good',
  'Excellent',
]

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Mock tracking ID prefix
export const TRACKING_PREFIX = 'UNILAG'
