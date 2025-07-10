import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasPagination = searchParams.has("page");
    const searchTerm = searchParams.get("search") || "";

    const whereClause = searchTerm
      ? {
          nom: {
            contains: searchTerm,
            mode: "insensitive" as const,
          },
        }
      : {};

    if (hasPagination) {
      const page = Number(searchParams.get("page")) || 1;
      const perPage = 10;
      const skip = (page - 1) * perPage;

      const [enqueteurs, totalEnqueteurs] = await Promise.all([
        prisma.enqueteur.findMany({
          where: whereClause,
          skip,
          take: perPage,
          include: {
            enquetes: {
              include: {
                secteur: true,
                collecteur: {
                  include: {
                    produitsAchetes: true,
                  },
                },
                pecheur: true,
              },
            },
          },
          orderBy: {
            nom: "asc",
          },
        }),
        prisma.enqueteur.count({ where: whereClause }),
      ]);

      const formattedEnqueteurs = enqueteurs.map((enqueteur) => ({
        id: enqueteur.id,
        nom: enqueteur.nom,
        prenom: enqueteur.prenom,
        code: enqueteur.code,
        image: enqueteur.image,
        telephone: enqueteur.telephone,
        email: enqueteur.email,
        actif: enqueteur.actif,
        enquetesCount: enqueteur.enquetes.length,
        totalCollecteurs: enqueteur.enquetes.reduce(
          (sum, enq) => sum + (enq.collecteur ? 1 : 0),
          0
        ),
        totalPecheurs: enqueteur.enquetes.reduce(
          (sum, enq) => sum + (enq.pecheur ? 1 : 0),
          0
        ),
      }));

      return NextResponse.json({
        data: formattedEnqueteurs,
        total: totalEnqueteurs,
        page,
        totalPages: Math.ceil(totalEnqueteurs / perPage),
      });
    } else {
      // Cas sans pagination
      const enqueteurs = await prisma.enqueteur.findMany({
        where: whereClause,
        include: {
          enquetes: {
            include: {
              secteur: true,
              collecteur: {
                include: {
                  produitsAchetes: true,
                },
              },
              pecheur: true,
            },
          },
        },
        orderBy: {
          nom: "asc",
        },
      });

      const formattedEnqueteurs = enqueteurs.map((enqueteur) => ({
        id: enqueteur.id,
        nom: enqueteur.nom,
        enquetesCount: enqueteur.enquetes.length,
        totalCollecteurs: enqueteur.enquetes.reduce(
          (sum, enq) => sum + (enq.collecteur ? 1 : 0),
          0
        ),
        totalPecheurs: enqueteur.enquetes.reduce(
          (sum, enq) => sum + (enq.pecheur ? 1 : 0),
          0
        ),
      }));

      return NextResponse.json({
        data: formattedEnqueteurs,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Échec de la récupération des enquêteurs",
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
  try {
    const json = await request.json();

    // Check for unique fields
    if (json.nom) {
      const existingByNom = await prisma.enqueteur.findUnique({
        where: { nom: json.nom },
      });
      if (existingByNom) {
        return NextResponse.json(
          { error: "Enqueteur with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (json.code) {
      const existingByCode = await prisma.enqueteur.findUnique({
        where: { code: json.code },
      });
      if (existingByCode) {
        return NextResponse.json(
          { error: "Enqueteur with this code already exists" },
          { status: 400 }
        );
      }
    }

    if (json.email) {
      const existingByEmail = await prisma.enqueteur.findUnique({
        where: { email: json.email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: "Enqueteur with this email already exists" },
          { status: 400 }
        );
      }
    }

    const enqueteur = await prisma.enqueteur.create({
      data: json,
    });

    return NextResponse.json({
      message: "Enqueteur created successfully",
      data: enqueteur,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create enqueteur" },
      { status: 500 }
    );
  }
}
