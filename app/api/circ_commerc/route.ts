// app/api/circuit-commercial/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const circuits = await prisma.circuitCommercialProduit.findMany({
      include: {
        pecheur: true,
        destinations: true,
      },
    });
    return NextResponse.json(circuits);
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch commercial circuits' },
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

    const circuit = await prisma.circuitCommercialProduit.create({
      data: {
        ...json,
        destinations: json.destinations
          ? {
              create: json.destinations,
            }
          : undefined,
      },
      include: {
        pecheur: true,
        destinations: true,
      },
    });

    return NextResponse.json({
      message: 'Commercial circuit created successfully',
      data: circuit,
    });
  } catch  {
    return NextResponse.json(
      { error: 'Failed to create commercial circuit' },
      { status: 500 }
    );
  }
}
