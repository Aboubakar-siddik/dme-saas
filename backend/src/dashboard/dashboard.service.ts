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
  async getWeeklyStats(clinicId: string) {
  const days: { day: string; consultations: number; revenu: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const [count, revenue] = await Promise.all([
      this.prisma.visit.count({
        where: {
          clinicId,
          visitDate: { gte: date, lt: nextDate },
        },
      }),
      this.prisma.visit.aggregate({
        where: {
          clinicId,
          visitDate: { gte: date, lt: nextDate },
        },
        _sum: { fee: true },
      }),
    ]);

    days.push({
      day: dayNames[date.getDay()],
      consultations: count,
      revenu: revenue._sum.fee || 0,
    });
  }

  return days;
}

    // Répartition par sexe
    async getGenderStats(clinicId: string) {
      const result = await this.prisma.patient.groupBy({
        by: ['sex'],
        where: { clinicId, sex: { not: null } },
        _count: true,
      });

      return result.map(r => ({
        name: r.sex === 'MALE' ? 'Hommes' : 'Femmes',
        value: r._count,
      }));
    }

    // Répartition par tranche d'âge
    async getAgeStats(clinicId: string) {
      const patients = await this.prisma.patient.findMany({
        where: { clinicId, dateOfBirth: { not: null } },
        select: { dateOfBirth: true },
      });

      const ageGroups = {
        '0-10 ans': 0, '11-20 ans': 0, '21-40 ans': 0,
        '41-60 ans': 0, '60+ ans': 0,
      };

      const now = new Date();
      patients.forEach(p => {
        const age = Math.floor((now.getTime() - new Date(p.dateOfBirth!).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age <= 10) ageGroups['0-10 ans']++;
        else if (age <= 20) ageGroups['11-20 ans']++;
        else if (age <= 40) ageGroups['21-40 ans']++;
        else if (age <= 60) ageGroups['41-60 ans']++;
        else ageGroups['60+ ans']++;
      });

      return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
    }

    // Top 10 des diagnostics
    async getDiagnosisStats(clinicId: string) {
      const visits = await this.prisma.visit.findMany({
        where: { clinicId, diagnosis: { not: null }, status: 'COMPLETED' },
        select: { diagnosis: true },
      });

      const diagnosisCount: Record<string, number> = {};
      visits.forEach(v => {
        const diag = v.diagnosis || 'Non spécifié';
        diagnosisCount[diag] = (diagnosisCount[diag] || 0) + 1;
      });

      return Object.entries(diagnosisCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));
    }

    // Évolution des consultations sur 30 jours
    async getConsultationTrend(clinicId: string) {
      const days: { date: string; consultations: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await this.prisma.visit.count({
          where: { clinicId, visitDate: { gte: date, lt: nextDate } },
        });

        days.push({
          date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          consultations: count,
        });
      }
      return days;
    }

    // Répartition géographique (par ville)
    async getGeographicStats(clinicId: string) {
      const result = await this.prisma.patient.groupBy({
        by: ['cityOfResidence'],
        where: { clinicId, cityOfResidence: { not: null } },
        _count: true,
      });

      return result
        .sort((a, b) => b._count - a._count)
        .map(r => ({ name: r.cityOfResidence || 'Inconnue', value: r._count }));
    }
}
