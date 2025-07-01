import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const enquete = await prisma.enquete.findUnique({
      where: { id: id },
      include: {
        enqueteur: true,
        secteur: true,
        pecheur: true,
        collecteur: true,
        membresFamille: true,
        activites: true,
      },
    });

    if (!enquete) {
      return NextResponse.json({ error: "Enquete not found" }, { status: 404 });
    }

    return NextResponse.json(enquete);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquete" },
      { status: 500 }
    );
  }
}

// Define the EnqueteData type if not already imported
interface EnqueteData {
  nomPerscible?: string;
  nomRepondant: string;
  estPecheur?: boolean;
  estCollecteur?: boolean;
  touteActivite?: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete?: string | Date;
  enqueteurId?: string;
  secteurId?: string;
  membresFamille?: Array<{
    nom: string;
    age: number;
    ancienLieuResidence?: string | null;
    villageOrigine?: string | null;
    anneeArrivee?: number | null;
    niveauEducation?: string | null;
    lienFamilial?: string | null;
    sexe?: string | null;
    frequentationEcole?: boolean | null;
  }>;
}

export async function PUT(request: Request) {
  const data: EnqueteData & { id: string } = await request.json();

  // Vérification de l'ID de l'enquête
  if (!data.id) {
    return NextResponse.json(
      { message: "L'ID de l'enquête est requis pour la mise à jour" },
      { status: 400 }
    );
  }

  // Vérification que l'enquête existe
  const existingEnquete = await prisma.enquete.findUnique({
    where: { id: data.id },
    include: { membresFamille: true },
  });

  if (!existingEnquete) {
    return NextResponse.json(
      { message: "L'enquête spécifiée n'existe pas" },
      { status: 404 }
    );
  }

  // Validations similaires à la création
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
    : existingEnquete.dateEnquete;

  // Gestion des membres de famille (suppression des anciens et création des nouveaux)
  const membresToDelete = existingEnquete.membresFamille.map(
    (membre) => membre.id
  );

  interface MembreFamilleInput {
    nom: string;
    age: number;
    ancienLieuResidence?: string | null;
    villageOrigine?: string | null;
    anneeArrivee?: number | null;
    niveauEducation?: string | null;
    lienFamilial?: string | null;
    sexe?: string | null;
    frequentationEcole?: boolean | null;
  }

  const updatedEnquete = await prisma.enquete.update({
    where: { id: data.id },
    data: {
      nomPerscible: data.nomPerscible,

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
        deleteMany: { id: { in: membresToDelete } },
        create:
          data.membresFamille?.map((membre: MembreFamilleInput) => ({
            nom: membre.nom,
            age: membre.age,
            ancienLieuResidence: membre.ancienLieuResidence,
            villageOrigine: membre.villageOrigine,
            anneeArrivee: membre.anneeArrivee,
            niveauEducation: membre.niveauEducation,
            lienFamilial: membre.lienFamilial,
            sexe: membre.sexe,
            frequentationEcole: membre.frequentationEcole,
          })) || [],
      },
      //  update pecheur and collecteur if they exist
      ...(data.estPecheur && {
        pecheur: { upsert: { create: {}, update: {} } },
      }),
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
      message: "Enquête mise à jour avec succès",
      data: updatedEnquete,
    },
    { status: 200 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquete = await prisma.enquete.findUnique({
      where: { id: id },
    });

    if (!enquete) {
      return NextResponse.json({ error: "Enquete not found" }, { status: 404 });
    }

    await prisma.enquete.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Enquete deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete enquete" },
      { status: 500 }
    );
  }
}
