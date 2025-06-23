// app/api/enquetes/create/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
interface MembreFamille {
  nom: string;
  age: number;
  ancienLieuResidence: string;
  villageOrigine: string;
  anneeArrivee: number;
  niveauEducation: string;
  lienFamilial: string;
  sexe: string;
  frequentationEcole: boolean;
}

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { membresFamille, estPecheur, estCollecteur, ...enqueteData } =
      await request.json();

    // Création de l'enquête avec les membres de famille
    const newEnquete = await prisma.enquete.create({
      data: {
        ...enqueteData,
        membresFamille: {
          create: membresFamille.map((membre: MembreFamille) => ({
            nom: membre.nom,
            age: membre.age,
            ancienLieuResidence: membre.ancienLieuResidence,
            villageOrigine: membre.villageOrigine,
            anneeArrivee: membre.anneeArrivee,
            niveauEducation: membre.niveauEducation,
            lienFamilial: membre.lienFamilial,
            sexe: membre.sexe,
            frequentationEcole: membre.frequentationEcole,
          })),
        },
        // Gestion des relations conditionnelles
        ...(estPecheur && { pecheur: { create: {} } }),
        ...(estCollecteur && { collecteur: { create: {} } }),
      },
      include: {
        membresFamille: true,
        pecheur: true,
        collecteur: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Enquête créée avec succès',
        data: newEnquete,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating enquete:', error);
    return NextResponse.json(
      {
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
