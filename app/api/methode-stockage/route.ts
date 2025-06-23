// app/api/methode-stockage/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const methodes = await prisma.methodeStockage.findMany({
      include: {
        operateur: true,
      },
    });
    return NextResponse.json(methodes);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch storage methods' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate operateur exists
    const operateurExists = await prisma.collecteur.findUnique({
      where: { id: json.operateurId },
    });

    if (!operateurExists) {
      return NextResponse.json(
        { error: 'Collecteur not found' },
        { status: 404 }
      );
    }

    const methode = await prisma.methodeStockage.create({
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Storage method created successfully',
      data: methode,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create storage method' },
      { status: 500 }
    );
  }
}
