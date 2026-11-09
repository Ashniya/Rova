import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  try {
    const { page = '1', limit = '50', action, entity } = req.query;
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (action) where.action = String(action);
    if (entity) where.entity = String(entity);

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        logs,
      },
    });
  } catch (error: any) {
    console.error('Audit logs error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getSystemStats(_req: Request, res: Response): Promise<void> {
  try {
    const [
      userCount,
      operatorCount,
      busCount,
      routeCount,
      tripCount,
      bookingCount,
      refundCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.operator.count(),
      prisma.bus.count(),
      prisma.route.count(),
      prisma.trip.count(),
      prisma.booking.count(),
      prisma.refund.count(),
    ]);

    const bookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      select: { totalAmount: true },
    });
    const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const refunds = await prisma.refund.findMany({
      where: { status: 'PROCESSED' },
      select: { refundAmount: true },
    });
    const totalRefunded = refunds.reduce((sum, r) => sum + r.refundAmount, 0);

    res.json({
      success: true,
      data: {
        userCount,
        operatorCount,
        busCount,
        routeCount,
        tripCount,
        bookingCount,
        refundCount,
        totalGrossRevenue,
        totalRefunded,
        netRevenue: Math.round((totalGrossRevenue - totalRefunded) * 100) / 100,
      },
    });
  } catch (error: any) {
    console.error('System stats error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getAllUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
