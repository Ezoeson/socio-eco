import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const enqueteurs = await prisma.enqueteur.findMany({
      include: {
        enquetes: {
          include: {
            secteur: true,
            collecteur: {
              include: {
                produitsAchetes: true,
                methodesStockage: true,
              },
            },
            pecheur: true,
          },
        },
      },
    });
    return NextResponse.json(enqueteurs);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch enqueteurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Check for unique fields
    if (json.nom) {
      const existingByNom = await prisma.enqueteur.findUnique({
        where: { nom: json.nom },
      });
      if (existingByNom) {
        return NextResponse.json(
          { error: 'Enqueteur with this name already exists' },
          { status: 400 }
        );
      }
    }

    if (json.code) {
      const existingByCode = await prisma.enqueteur.findUnique({
        where: { code: json.code },
      });
      if (existingByCode) {
        return NextResponse.json(
          { error: 'Enqueteur with this code already exists' },
          { status: 400 }
        );
      }
    }

    if (json.email) {
      const existingByEmail = await prisma.enqueteur.findUnique({
        where: { email: json.email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: 'Enqueteur with this email already exists' },
          { status: 400 }
        );
      }
    }

    const enqueteur = await prisma.enqueteur.create({
      data: json,
    });

    return NextResponse.json({
      message: 'Enqueteur created successfully',
      data: enqueteur,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create enqueteur' },
      { status: 500 }
    );
  }
}
