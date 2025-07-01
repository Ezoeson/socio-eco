import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Utilisez l'instance partagée plutôt que new PrismaClient()
import { NiveauEducation } from "@prisma/client";

interface MembreFamille {
  nom: string;
  age?: number;
  ancienLieuResidence: string;
  villageOrigine: string;
  anneeArrivee: number;
  niveauEducation: string;
  lienFamilial: string;
  sexe?: string;
  frequentationEcole: boolean;
}

interface EnqueteData {
  nomPerscible: string;
  nomRepondant: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete?: Date | string;
  enqueteurId?: string;
  secteurId?: string;
  membresFamille: MembreFamille[];
}

export async function GET() {
  try {
    const enquetes = await prisma.enquete.findMany({
      include: {
        enqueteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
        secteur: true,
        pecheur: true,
        collecteur: true,
        membresFamille: true,
        activites: true,
      },
    });
    return NextResponse.json(enquetes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquetes" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  const data: EnqueteData = await request.json();

  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }
  if (data.enqueteurId) {
    const enqueteurExists = await prisma.enqueteur.findUnique({
      where: { id: data.enqueteurId },
    });
    if (!enqueteurExists) {
      return NextResponse.json(
        { message: "L'enquêteur spécifié n'existe pas" },
        { status: 400 }
      );
    }
  }

  if (data.secteurId) {
    const secteurExists = await prisma.secteur.findUnique({
      where: { id: data.secteurId },
    });
    if (!secteurExists) {
      return NextResponse.json(
        { message: "Le secteur spécifié n'existe pas" },
        { status: 400 }
      );
    }
  }

  const dateEnquete = data.dateEnquete
    ? new Date(data.dateEnquete)
    : new Date();

  const newEnquete = await prisma.enquete.create({
    data: {
      nomPerscible: data.nomPerscible || "Enquête Famille",
      nomRepondant: data.nomRepondant,
      estPecheur: data.estPecheur,
      estCollecteur: data.estCollecteur,
      touteActivite: data.touteActivite,
      ethnie: data.ethnie,
      districtOrigine: data.districtOrigine,
      anneeArriveeVillage: data.anneeArriveeVillage,
      possessionAncienMetier: data.possessionAncienMetier,
      ancienMetier: data.ancienMetier,
      dateEnquete: dateEnquete,
      enqueteurId: data.enqueteurId,
      secteurId: data.secteurId,
      membresFamille: {
        create:
          data.membresFamille?.map((membre) => ({
            nom: membre.nom,
            age: membre.age,
            ancienLieuResidence: membre.ancienLieuResidence,
            villageOrigine: membre.villageOrigine,
            anneeArrivee: membre.anneeArrivee,
            niveauEducation: membre.niveauEducation as NiveauEducation,

            lienFamilial: membre.lienFamilial,
            sexe: membre.sexe,
            frequentationEcole: membre.frequentationEcole,
          })) || [],
      },
      ...(data.estPecheur && { pecheur: { create: {} } }),
    },
    include: {
      membresFamille: true,
      pecheur: data.estPecheur,
      collecteur: data.estCollecteur,
      enqueteur: true,
      secteur: true,
    },
  });

  return NextResponse.json(
    {
      message: "Enquête créée avec succès",
      data: newEnquete,
    },
    { status: 201 }
  );
}
