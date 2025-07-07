// app/api/region/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasPagination = searchParams.has("page");
    const searchTerm = searchParams.get("search") || "";

    // Clause where pour filtrer les régions par nom (insensible à la casse)
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

      const [regions, totalRegions] = await Promise.all([
        prisma.region.findMany({
          where: whereClause,
          skip: skip,
          take: perPage,
          select: {
            id: true,
            nom: true,
            districts: {
              select: {
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
            },
          },
          orderBy: {
            nom: "asc",
          },
        }),
        prisma.region.count({ where: whereClause }),
      ]);

      const formattedRegions = regions.map((region) => ({
        id: region.id,
        nom: region.nom,
        districts: region.districts.length,
        communes: region.districts.reduce(
          (acc, district) => acc + district.communes.length,
          0
        ),
        fokontany: region.districts.reduce(
          (acc, district) =>
            acc +
            district.communes.reduce(
              (communeAcc, commune) => communeAcc + commune._count.fokontanys,
              0
            ),
          0
        ),
      }));

      return NextResponse.json({
        data: formattedRegions,
        total: totalRegions,
        page,
        totalPages: Math.ceil(totalRegions / perPage),
      });
    } else {
      // Sans pagination
      const regions = await prisma.region.findMany({
        where: whereClause,
        select: {
          id: true,
          nom: true,
          districts: {
            select: {
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
          },
        },
        orderBy: {
          nom: "asc",
        },
      });

      const formattedRegions = regions.map((region) => ({
        id: region.id,
        nom: region.nom,
        districts: region.districts.length,
        communes: region.districts.reduce(
          (acc, district) => acc + district.communes.length,
          0
        ),
        fokontany: region.districts.reduce(
          (acc, district) =>
            acc +
            district.communes.reduce(
              (communeAcc, commune) => communeAcc + commune._count.fokontanys,
              0
            ),
          0
        ),
      }));

      return NextResponse.json({
        data: formattedRegions,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch regions data",
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
  const json = await request.json();
  const post = await prisma.region.create({
    data: json,
  });
  return NextResponse.json({
    message: "Region created successfully",
    data: post,
  });
}
