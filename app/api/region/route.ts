// app/api/region/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
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

    return NextResponse.json(formattedRegions);
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch regions data' },
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
    message: 'Region created successfully',
    data: post,
  });
}
