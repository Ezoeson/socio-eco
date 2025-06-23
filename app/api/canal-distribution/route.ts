// app/api/canal-distribution/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const canaux = await prisma.canalDistribution.findMany({
      include: {
        operateur: true,
      },
    });
    return NextResponse.json(canaux);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch distribution channels' },
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

    const canal = await prisma.canalDistribution.create({
      data: json,
      include: {
        operateur: true,
      },
    });

    return NextResponse.json({
      message: 'Distribution channel created successfully',
      data: canal,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create distribution channel' },
      { status: 500 }
    );
  }
}
