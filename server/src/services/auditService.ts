import prisma from '../prisma';

export interface CreateAuditLogParams {
  action: string;
  entity: string;
  entityId: string;
  userId?: string | null;
  details?: string | object;
  ipAddress?: string;
}

export async function logAuditEvent(params: CreateAuditLogParams): Promise<void> {
  try {
    const detailsStr = typeof params.details === 'object' ? JSON.stringify(params.details) : params.details;
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        userId: params.userId || null,
        details: detailsStr || null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
