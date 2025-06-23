import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pratiques = await prisma.pratiquePeche.findMany({
      include: {
        pecheur: true,
      },
    });
    return NextResponse.json(pratiques);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch fishing practices' },
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

    // Check unique constraint (pecheurId + especeCible)
    if (json.especeCible) {
      const existingPratique = await prisma.pratiquePeche.findFirst({
        where: {
          pecheurId: json.pecheurId,
          especeCible: json.especeCible,
        },
      });

      if (existingPratique) {
        return NextResponse.json(
          {
            error:
              'Fishing practice for this species already exists for this pecheur',
          },
          { status: 400 }
        );
      }
    }

    const pratique = await prisma.pratiquePeche.create({
      data: json,
      include: {
        pecheur: true,
      },
    });

    return NextResponse.json({
      message: 'Fishing practice created successfully',
      data: pratique,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create fishing practice' },
      { status: 500 }
    );
  }
}
