// app/api/pecheur/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pecheurs = await prisma.pecheur.findMany({
      include: {
        enquete: true,
        pratiquesPeche: true,
        equipementsPeche: true,
        embarcations: true,
        circuitsCommercial: true,
        activites: true,
      },
    });
    return NextResponse.json(pecheurs);
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch pecheurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate enquete exists and is unique
    const enqueteExists = await prisma.enquete.findUnique({
      where: { id: json.enqueteId },
    });

    if (!enqueteExists) {
      return NextResponse.json({ error: 'Enquete not found' }, { status: 404 });
    }

    const existingPecheur = await prisma.pecheur.findUnique({
      where: { enqueteId: json.enqueteId },
    });

    if (existingPecheur) {
      return NextResponse.json(
        { error: 'Pecheur already exists for this enquete' },
        { status: 400 }
      );
    }

    const pecheur = await prisma.pecheur.create({
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: 'Pecheur created successfully',
      data: pecheur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create pecheur' },
      { status: 500 }
    );
  }
}
