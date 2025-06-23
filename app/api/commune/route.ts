

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const communes = await prisma.commune.findMany({
      include: {
        district: true,
        fokontanys: true,
      },
    });
    return NextResponse.json(communes);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch communes' },
      { status: 500 }
    );
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
        { error: 'District not found' },
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
        { error: 'Commune with this name already exists in this district' },
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
      message: 'Commune created successfully',
      data: commune,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create commune' },
      { status: 500 }
    );
  }
}
