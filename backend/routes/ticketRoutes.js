const express = require('express');
const { 
  createTicket, 
  getTickets, 
  getTicketById, 
  addComment, 
  updateTicketStatus 
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply protect middleware to all ticket routes
router.use(protect);

router.route('/')
  .post(upload.array('images', 3), createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicketById);

router.post('/:id/comments', addComment);

// Only admins, faculty, staff and non-staff can update status
router.put('/:id/status', authorize('admin', 'faculty', 'staff', 'non-staff'), updateTicketStatus);

module.exports = router;

