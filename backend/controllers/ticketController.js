const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateTrackingId = () => {
  return `UNILAG-${Math.floor(10000 + Math.random() * 90000)}`;
};

exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, category, subcategory, urgency, location, isAnonymous } = req.body;
    
    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const ticket = await prisma.ticket.create({
      data: {
        trackingId: generateTrackingId(),
        title,
        description,
        category,
        subcategory,
        urgency,
        location,
        isAnonymous: isAnonymous === 'true' || isAnonymous === true,
        images: JSON.stringify(images),
        submittedById: req.user.id
      },
      include: {
        submittedBy: { select: { name: true, email: true } }
      }
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    let whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { trackingId: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If student, only see their own tickets, unless admin/faculty
    if (req.user.role === 'student') {
      whereClause.submittedById = req.user.id;
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        submittedBy: { select: { name: true } },
        comments: { select: { id: true } } // just get count logic basically
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    next(err);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        submittedBy: { select: { name: true, email: true, department: true } },
        comments: {
          include: {
            author: { select: { name: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && ticket.submittedById !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    const ticket = await prisma.ticket.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        message,
        isAdmin: req.user.role === 'admin' || req.user.role === 'faculty',
        ticketId: ticket.id,
        authorId: req.user.id
      },
      include: {
        author: { select: { name: true, role: true } }
      }
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    res.status(200).json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

