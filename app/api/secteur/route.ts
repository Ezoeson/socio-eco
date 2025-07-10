import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasPagination = searchParams.has("page");
    const searchTerm = searchParams.get("search") || "";

    // Clause where pour filtrer les secteurs par nom (insensible à la casse)
    const whereClause = searchTerm
      ? {
          nom: {
            contains: searchTerm,
            mode: "insensitive" as const,
          },
        }
      : {};

    if (hasPagination) {
      const page = parseInt(searchParams.get("page") || "1");
      const perPage = 10;
      const skip = (page - 1) * perPage;

      const [secteurs, totalSecteurs] = await Promise.all([
        prisma.secteur.findMany({
          where: whereClause,
          skip: skip,
          take: perPage,
          include: {
            fokontany: {
              select: {
                id: true,
                nom: true,
              },
            },
            enquetes: {
              select: {
                id: true,
                nomPerscible: true,
                dateEnquete: true,
              },
            },
          },
          orderBy: {
            nom: "asc", // Ajout du tri alphabétique pour cohérence
          },
        }),
        prisma.secteur.count({ where: whereClause }),
      ]);

      // Formatage optionnel des données
      const formattedSecteurs = secteurs.map((secteur) => ({
        ...secteur,
        enqueteCount: secteur.enquetes.length,
      }));

      return NextResponse.json({
        data: formattedSecteurs,

        total: totalSecteurs,
        page,

        totalPages: Math.ceil(totalSecteurs / perPage),
      });
    } else {
      // Sans pagination
      const secteurs = await prisma.secteur.findMany({
        where: whereClause,
        include: {
          fokontany: {
            include: {
              commune: {
                include: {
                  district: {
                    include: {
                      region: true,
                    },
                  },
                },
              },
            },
          },
          enquetes: {
            select: {
              id: true,
              nomPerscible: true,
              dateEnquete: true,
            },
          },
        },
        orderBy: {
          nom: "asc",
        },
      });

      // Formatage optionnel des données
      const formattedSecteurs = secteurs.map((secteur) => ({
        ...secteur,
        enqueteCount: secteur.enquetes.length,
      }));

      return NextResponse.json({
        data: formattedSecteurs,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch secteurs data",
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

    const fokontanyExists = await prisma.fokontany.findUnique({
      where: { id: json.fokontanyId },
    });

    if (!fokontanyExists) {
      return NextResponse.json(
        { error: "Fokontany not found" },
        { status: 404 }
      );
    }

    const existingSecteur = await prisma.secteur.findFirst({
      where: {
        nom: json.nom,
        fokontanyId: json.fokontanyId,
      },
    });

    if (existingSecteur) {
      return NextResponse.json(
        { error: "Secteur with this name already exists in this fokontany" },
        { status: 400 }
      );
    }

    const secteur = await prisma.secteur.create({
      data: json,
      include: {
        fokontany: true,
      },
    });

    return NextResponse.json({
      message: "Secteur created successfully",
      data: secteur,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create secteur" },
      { status: 500 }
    );
  }
}
