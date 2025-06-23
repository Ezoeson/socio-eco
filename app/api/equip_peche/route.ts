// app/api/equipement-peche/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const equipements = await prisma.equipementPeche.findMany({
      include: {
        pecheur: true,
      },
    });
    return NextResponse.json(equipements);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing equipment' },
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

    const equipement = await prisma.equipementPeche.create({
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing equipment created successfully',
      data: equipement,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create fishing equipment' },
      { status: 500 }
    );
  }
}
