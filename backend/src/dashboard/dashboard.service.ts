import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(clinicId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Exécuter toutes les requêtes en parallèle
    const [
      totalPatients,
      todayVisits,
      waitingVisits,
      todayRevenue,
      recentVisits,
    ] = await Promise.all([
      // Nombre total de patients dans la clinique
      this.prisma.patient.count({
        where: { clinicId },
      }),

      // Nombre de visites aujourd'hui
      this.prisma.visit.count({
        where: {
          clinicId,
          visitDate: { gte: today, lt: tomorrow },
        },
      }),

      // Visites en attente
      this.prisma.visit.count({
        where: {
          clinicId,
          status: 'WAITING',
        },
      }),

      // Revenu du jour
      this.prisma.visit.aggregate({
        where: {
          clinicId,
          visitDate: { gte: today, lt: tomorrow },
        },
        _sum: { fee: true },
      }),

      // 5 dernières visites
      this.prisma.visit.findMany({
        where: { clinicId },
        orderBy: { visitDate: 'desc' },
        take: 5,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
      totalPatients,
      todayVisits,
      waitingVisits,
      todayRevenue: todayRevenue._sum.fee || 0,
      recentVisits,
    };
  }
}