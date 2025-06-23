/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/collecteur/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const collecteurs = await prisma.collecteur.findMany({
      include: {
        enquete: true,
        produitsAchetes: true,
        methodesStockage: true,
        canauxDistribution: true,
        activites: true,
      },
    });
    return NextResponse.json(collecteurs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collecteurs' },
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

    const existingCollecteur = await prisma.collecteur.findUnique({
      where: { enqueteId: json.enqueteId },
    });

    if (existingCollecteur) {
      return NextResponse.json(
        { error: 'Collecteur already exists for this enquete' },
        { status: 400 }
      );
    }

    const collecteur = await prisma.collecteur.create({
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: 'Collecteur created successfully',
      data: collecteur,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create collecteur' },
      { status: 500 }
    );
  }
}
