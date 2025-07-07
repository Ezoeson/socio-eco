import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasPagination = searchParams.has("page");
    const searchTerm = searchParams.get("search") || "";

    // Clause where pour filtrer les fokontanys par nom (insensible à la casse)
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

      const [fokontanys, totalFokontanys] = await Promise.all([
        prisma.fokontany.findMany({
          where: whereClause,
          skip,
          take: perPage,
          include: {
            commune: {
              include: {
                district: true,
              },
            },
            secteurs: {
              select: {
                id: true,
                nom: true,
                _count: {
                  select: {
                    enquetes: true,
                  },
                },
              },
            },
          },
          orderBy: {
            nom: "asc",
          },
        }),
        prisma.fokontany.count({ where: whereClause }),
      ]);

      const formattedFokontanys = fokontanys.map((fokontany) => ({
        ...fokontany,
        secteurCount: fokontany.secteurs.length,
        totalEnquetes: fokontany.secteurs.reduce(
          (sum, secteur) => sum + secteur._count.enquetes,
          0
        ),
      }));

      return NextResponse.json({
        data: formattedFokontanys,
        total: totalFokontanys,
        page,
        totalPages: Math.ceil(totalFokontanys / perPage),
      });
    } else {
      // Sans pagination
      const fokontanys = await prisma.fokontany.findMany({
        where: whereClause,
        include: {
          commune: {
            include: {
              district: true,
            },
          },
          secteurs: {
            select: {
              id: true,
              nom: true,
              _count: {
                select: {
                  enquetes: true,
                },
              },
            },
          },
        },
        orderBy: {
          nom: "asc",
        },
      });

      const formattedFokontanys = fokontanys.map((fokontany) => ({
        ...fokontany,
        secteurCount: fokontany.secteurs.length,
        totalEnquetes: fokontany.secteurs.reduce(
          (sum, secteur) => sum + secteur._count.enquetes,
          0
        ),
      }));

      return NextResponse.json({
        data: formattedFokontanys,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch fokontanys",
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

    const communeExists = await prisma.commune.findUnique({
      where: { id: json.communeId },
    });

    if (!communeExists) {
      return NextResponse.json({ error: "Commune not found" }, { status: 404 });
    }

    const existingFokontany = await prisma.fokontany.findFirst({
      where: {
        nom: json.nom,
        communeId: json.communeId,
      },
    });

    if (existingFokontany) {
      return NextResponse.json(
        { error: "Fokontany with this name already exists in this commune" },
        { status: 400 }
      );
    }

    const fokontany = await prisma.fokontany.create({
      data: json,
      include: {
        commune: true,
      },
    });

    return NextResponse.json({
      message: "Fokontany created successfully",
      data: fokontany,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create fokontany" },
      { status: 500 }
    );
  }
}
