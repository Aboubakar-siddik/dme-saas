import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ImnService {
  constructor(private readonly prisma: PrismaService) {}

  async generateIMN(): Promise<string> {
    const year = new Date().getFullYear();
    
    // Compter le nombre de patients avec IMN cette année
    const count = await this.prisma.patient.count({
      where: { imn: { startsWith: `CMR-${year}-` } },
    });

    // Incrémenter et formater sur 8 chiffres
    const sequence = String(count + 1).padStart(8, '0');
    
    // Créer l'IMN sans la clé
    const imnWithoutKey = `CMR-${year}-${sequence}`;
    
    // Calculer la clé de contrôle (modulo 10)
    const key = this.calculateKey(imnWithoutKey);
    
    return `${imnWithoutKey}-${key}`;
  }

  private calculateKey(imn: string): number {
    // Algorithme simple : somme des chiffres modulo 10
    const digits = imn.replace(/\D/g, '');
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i]) * (i + 1);
    }
    return sum % 10;
  }
}