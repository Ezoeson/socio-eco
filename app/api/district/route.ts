/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/district/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all districts
export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      include: {
        region: {
          select: {
            nom: true,
          },
        },
        communes: {
          select: {
            nom: true,
          },
        },
      },
    });
    return NextResponse.json(districts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch districts' },
      { status: 500 }
    );
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
        { error: 'District with this name already exists in this region' },
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
      message: 'District created successfully',
      data: district,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create district' },
      { status: 500 }
    );
  }
}
