import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Utilisez l'instance partagée plutôt que new PrismaClient()

import { EnqueteFormData } from "@/type/localType";
import { deleteRelatedRecords } from "../../function/delete";
import {
  createActiviteData,
  createCollecteurData,
  createMembreFamilleData,
  createPecheurData,
} from "../../function/create";
import getIncludeRelations from "../../function/getMany";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const enquete = await prisma.enquete.findUnique({
      where: { id: id },
      include: {
        enqueteur: true,
        secteur: true,
        pecheur: {
          include: {
            pratiquesPeche: true,
            equipementsPeche: true,
            embarcations: true,
            circuitsCommercial: {
              include: {
                destinations: true,
              },
            },
          },
        },
        collecteur: {
          include: {
            produitsAchetes: true,
            stockages: true,
            distributions: true,
            contratsAcheteur: true,
          },
        },
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

export async function PUT(request: Request) {
  const data: EnqueteFormData & { id: string } = await request.json();

  // Validation de base
  if (!data.id) {
    return NextResponse.json(
      { message: "L'ID de l'enquête est requis pour la mise à jour" },
      { status: 400 }
    );
  }

  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Vérification de l'existence de l'enquête
  const existingEnquete = await prisma.enquete.findUnique({
    where: { id: data.id },
    include: {
      pecheur: true,
      collecteur: true,
    },
  });

  if (!existingEnquete) {
    return NextResponse.json(
      { message: "Enquête non trouvée" },
      { status: 404 }
    );
  }

  // Validation des relations
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

  try {
    const updatedEnquete = await prisma.$transaction(async (prisma) => {
      // Suppression des relations existantes
      await deleteRelatedRecords(prisma, data.id, existingEnquete);

      // Mise à jour de l'enquête principale avec upsert pour les relations
      return await prisma.enquete.update({
        where: { id: data.id },
        data: {
          nomPerscible: data.nomPerscible || "Enquête Famille",
          nomRepondant: data.nomRepondant,
          estPecheur: data.estPecheur,
          estCollecteur: data.estCollecteur,
          touteActivite: data.touteActivite,
          localFokontany: data.localFokontany,
          ethnie: data.ethnie,
          districtOrigine: data.districtOrigine,
          anneeArriveeVillage: data.anneeArriveeVillage,
          possessionAncienMetier: data.possessionAncienMetier,
          ancienMetier: data.ancienMetier,
          dateEnquete: dateEnquete,
          enqueteurId: data.enqueteurId,
          secteurId: data.secteurId,

          // Membres famille
          membresFamille: data.membresFamille
            ? {
                create: data.membresFamille.map(createMembreFamilleData),
              }
            : undefined,

          // Pêcheur - utilisation de upsert
          pecheur: data.estPecheur
            ? {
                upsert: {
                  create: createPecheurData(data.Pecheur?.[0] || {}),
                  update: createPecheurData(data.Pecheur?.[0] || {}),
                },
              }
            : existingEnquete.pecheur
            ? { delete: true }
            : undefined,

          // Collecteur - utilisation de upsert
          collecteur: data.estCollecteur
            ? {
                upsert: {
                  create: createCollecteurData(data.collecteur?.[0] || {}),
                  update: createCollecteurData(data.collecteur?.[0] || {}),
                },
              }
            : existingEnquete.collecteur
            ? { delete: true }
            : undefined,

          // Activités
          activites: data.activites
            ? {
                create: data.activites.map(createActiviteData),
              }
            : undefined,
        },
        include: getIncludeRelations(),
      });
    });

    return NextResponse.json(
      {
        message: "Enquête mise à jour avec succès",
        data: updatedEnquete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enquête:", error);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la mise à jour de l'enquête",
        error: process.env.NODE_ENV === "development",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
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
