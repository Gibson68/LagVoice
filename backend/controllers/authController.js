const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId, staffId, department, faculty } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'student', // student, faculty, admin
        studentId,
        staffId,
        department,
        faculty
      }
    });

    // Mock OTP logic for now
    // await sendEmail({ to: email, subject: 'Welcome to LagVoice', text: 'Please verify your email.' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        staffId: user.staffId,
        department: user.department,
        faculty: user.faculty
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: 'Invalid role for this user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        staffId: user.staffId,
        department: user.department,
        faculty: user.faculty
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        staffId: true,
        department: true,
        faculty: true
      }
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department, faculty, studentId, staffId } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(department !== undefined && { department }),
        ...(faculty !== undefined && { faculty }),
        ...(studentId !== undefined && { studentId }),
        ...(staffId !== undefined && { staffId })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        staffId: true,
        department: true,
        faculty: true
      }
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
