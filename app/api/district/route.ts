import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all districts
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

      const [districts, totalDistricts] = await Promise.all([
        prisma.district.findMany({
          where: whereClause,
          skip,
          take: perPage,
          include: {
            region: {
              select: {
                id: true,
                nom: true,
              },
            },
            communes: {
              select: {
                _count: {
                  select: {
                    fokontanys: true,
                  },
                },
              },
            },
          },
          orderBy: {
            nom: "asc",
          },
        }),
        prisma.district.count({ where: whereClause }),
      ]);

      const formattedDistricts = districts.map((district) => ({
        id: district.id,
        nom: district.nom,
        region: district.region,
        communeCount: district.communes.length,
        totalFokontany: district.communes.reduce(
          (sum, commune) => sum + commune._count.fokontanys,
          0
        ),
      }));

      return NextResponse.json({
        data: formattedDistricts,
        total: totalDistricts,
        page,
        totalPages: Math.ceil(totalDistricts / perPage),
      });
    } else {
      // Cas sans pagination
      const districts = await prisma.district.findMany({
        where: whereClause,
        include: {
          region: {
            select: {
              id: true,
              nom: true,
            },
          },
          communes: {
            select: {
              _count: {
                select: {
                  fokontanys: true,
                },
              },
            },
          },
        },
        orderBy: {
          nom: "asc",
        },
      });

      const formattedDistricts = districts.map((district) => ({
        id: district.id,
        nom: district.nom,
        region: district.region,
        communeCount: district.communes.length,
        totalFokontany: district.communes.reduce(
          (sum, commune) => sum + commune._count.fokontanys,
          0
        ),
      }));

      return NextResponse.json({
        data: formattedDistricts,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Échec de la récupération des districts",
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

// POST create new district
export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Check for unique constraint (nom + regionId)
    const existingDistrict = await prisma.district.findFirst({
      where: {
        nom: json.nom,
        regionId: json.regionId,
      },
    });

    if (existingDistrict) {
      return NextResponse.json(
        { error: "District with this name already exists in this region" },
        { status: 400 }
      );
    }

    const district = await prisma.district.create({
      data: json,
      include: {
        region: true,
      },
    });

    return NextResponse.json({
      message: "District created successfully",
      data: district,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create district" },
      { status: 500 }
    );
  }
}
