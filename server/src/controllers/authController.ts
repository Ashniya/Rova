import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateToken } from '../middleware/auth';
import { logAuditEvent } from '../services/auditService';
import { seedDatabase } from '../services/seedService';

export async function handleSeed(_req: Request, res: Response): Promise<void> {
  try {
    const result = await seedDatabase(prisma);
    res.json(result);
  } catch (error: any) {
    console.error('Seed handler error:', error);
    res.status(500).json({ success: false, message: error.message || 'Seeding failed' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone, role, operatorCode, operatorName } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'OPERATOR' || role === 'ADMIN' ? role : 'PASSENGER';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        role: userRole,
      },
    });

    let operatorId: string | undefined = undefined;
    if (userRole === 'OPERATOR') {
      const code = operatorCode || `OP-${Date.now().toString(36).toUpperCase()}`;
      const op = await prisma.operator.create({
        data: {
          name: operatorName || `${name} Travels`,
          code,
          contactEmail: user.email,
          contactPhone: phone || '1800-ROVA-BUS',
          userId: user.id,
        },
      });
      operatorId = op.id;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      operatorId,
    });

    await logAuditEvent({
      action: 'USER_REGISTERED',
      entity: 'USER',
      entityId: user.id,
      userId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          operatorId,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { operator: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      operatorId: user.operator?.id || null,
    });

    await logAuditEvent({
      action: 'USER_LOGGED_IN',
      entity: 'USER',
      entityId: user.id,
      userId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          operatorId: user.operator?.id || null,
          operatorName: user.operator?.name || null,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { operator: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        operatorId: user.operator?.id || null,
        operator: user.operator,
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
