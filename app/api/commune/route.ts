import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasPagination = searchParams.has("page");
    const searchTerm = searchParams.get("search") || "";

    // Clause where pour filtrer les communes par nom (insensible à la casse)
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

      // Appliquer whereClause dans findMany et count
      const [communes, totalCommunes] = await Promise.all([
        prisma.commune.findMany({
          where: whereClause, // <-- ici on filtre
          skip,
          take: perPage,
          include: {
            district: {
              select: {
                id: true,
                nom: true,
                region: {
                  select: {
                    id: true,
                    nom: true,
                  },
                },
              },
            },
            fokontanys: true,
          },
          orderBy: {
            nom: "asc",
          },
        }),
        prisma.commune.count({ where: whereClause }),
      ]);

      const formattedCommunes = communes.map((commune) => ({
        id: commune.id,
        nom: commune.nom,
        district: commune.district,
        fokontanyCount: commune.fokontanys.length,
      }));

      return NextResponse.json({
        data: formattedCommunes,
        total: totalCommunes,
        page,
        totalPages: Math.ceil(totalCommunes / perPage),
      });
    } else {
      // Sans pagination, on applique aussi le filtre
      const communes = await prisma.commune.findMany({
        where: whereClause, // <-- filtre aussi ici
        include: {
          district: {
            select: {
              id: true,
              nom: true,
              region: {
                select: {
                  id: true,
                  nom: true,
                },
              },
            },
          },
          fokontanys: true,
        },
        orderBy: {
          nom: "asc",
        },
      });

      const formattedCommunes = communes.map((commune) => ({
        id: commune.id,
        nom: commune.nom,
        district: commune.district,
        fokontanyCount: commune.fokontanys.length,
      }));

      return NextResponse.json({
        data: formattedCommunes,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Échec de la récupération des communes",
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

    // Validation
    const districtExists = await prisma.district.findUnique({
      where: { id: json.districtId },
    });

    if (!districtExists) {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    const existingCommune = await prisma.commune.findFirst({
      where: {
        nom: json.nom,
        districtId: json.districtId,
      },
    });

    if (existingCommune) {
      return NextResponse.json(
        { error: "Commune with this name already exists in this district" },
        { status: 400 }
      );
    }

    const commune = await prisma.commune.create({
      data: json,
      include: {
        district: true,
      },
    });

    return NextResponse.json({
      message: "Commune created successfully",
      data: commune,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create commune" },
      { status: 500 }
    );
  }
}
