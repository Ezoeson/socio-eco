// app/api/embarcation-peche/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const embarcations = await prisma.embarcationPeche.findMany({
      include: {
        pecheur: true,
      },
    });
    return NextResponse.json(embarcations);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing boats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate pecheur exists
    const pecheurExists = await prisma.pecheur.findUnique({
      where: { id: json.pecheurId },
    });

    if (!pecheurExists) {
      return NextResponse.json({ error: 'Pecheur not found' }, { status: 404 });
    }

    const embarcation = await prisma.embarcationPeche.create({
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing boat created successfully',
      data: embarcation,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create fishing boat' },
      { status: 500 }
    );
  }
}
