import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { EnqueteFormData } from "@/type/localType";
import {
  createActiviteData,
  createCollecteurData,
  createMembreFamilleData,
  createPecheurData,
} from "../function/create";
import getIncludeRelations from "../function/getMany";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Common parameters
    const searchTerm = searchParams.get("search") || "";
    const hasPagination = searchParams.has("page");
    const page = Number(searchParams.get("page")) || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    // Date filters (from first example)
    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");

    // Build where clause
    const whereClause: any = {};

    // Search term filter (combined from both examples)
    if (searchTerm) {
      whereClause.OR = [
        // from district example
        { nomPerscible: { contains: searchTerm, mode: "insensitive" } }, // from enquete example
        { nomRepondant: { contains: searchTerm, mode: "insensitive" } }, // from enquete example
        {
          enqueteur: {
            // from enquete example
            OR: [
              { nom: { contains: searchTerm, mode: "insensitive" } },
              { prenom: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Date filter (from enquete example)
    if (dateDebut || dateFin) {
      whereClause.dateEnquete = {};
      if (dateDebut) whereClause.dateEnquete.gte = new Date(dateDebut);
      if (dateFin) whereClause.dateEnquete.lte = new Date(dateFin);
    }

    if (hasPagination) {
      const [enquetes, totalEnquetes] = await Promise.all([
        prisma.enquete.findMany({
          where: whereClause,
          skip,
          take: perPage,
          include: {
            enqueteur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
              },
            },
            secteur: {
              select: {
                id: true,
                nom: true,
              },
            },
            membresFamille: true,
          },
          orderBy: {
            dateEnquete: "desc",
          },
        }),
        prisma.enquete.count({ where: whereClause }),
      ]);

      return NextResponse.json({
        data: enquetes,
        total: totalEnquetes,
        page,
        totalPages: Math.ceil(totalEnquetes / perPage),
      });
    } else {
      // Case without pagination
      const enquetes = await prisma.enquete.findMany({
        where: whereClause,
        include: {
          enqueteur: {
            select: {
              nom: true,
              prenom: true,
            },
          },
          secteur: {
            include: {
              fokontany: {
                include: {
                  commune: {
                    include: {
                      district: {
                        include: {
                          region: {
                            select: {
                              nom: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          membresFamille: true,
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
          activites: true,
        },

        orderBy: {
          dateEnquete: "desc",
        },
      });

      return NextResponse.json({
        data: enquetes,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  const data: EnqueteFormData = await request.json();

  // Validations de base
  if (!data.nomRepondant) {
    return NextResponse.json(
      { message: "Le nom du répondant est requis" },
      { status: 400 }
    );
  }

  // Validation des relations existantes
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

  try {
    // Création de l'enquête avec toutes les relations
    const newEnquete = await prisma.enquete.create({
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

        // Membres de la famille
        membresFamille:
          data.membresFamille?.length > 0
            ? {
                create: data.membresFamille.map(createMembreFamilleData),
              }
            : undefined,

        // Collecteur
        collecteur:
          data.estCollecteur && data.collecteur?.[0]
            ? {
                create: createCollecteurData(data.collecteur[0]),
              }
            : undefined,

        // Pêcheur
        pecheur:
          data.estPecheur && data.Pecheur?.[0]
            ? {
                create: createPecheurData(data.Pecheur[0]),
              }
            : undefined,

        // Activités économiques
        activites:
          data.activites && data.activites.length > 0
            ? {
                create: data.activites.map(createActiviteData),
              }
            : undefined,
      },
      include: getIncludeRelations(),
    });

    return NextResponse.json(
      {
        message: "Enquête créée avec succès",
        data: newEnquete,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'enquête:", error);
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la création de l'enquête",
        error: process.env.NODE_ENV === "development",
      },
      { status: 500 }
    );
  }
}
