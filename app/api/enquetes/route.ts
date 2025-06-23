/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/enquete/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const enquetes = await prisma.enquete.findMany({
      include: {
        enqueteur: true,
        secteur: true,
        pecheur: true,
        collecteur: true,
        membresFamille: true,
        activites: true,
      },
    });
    return NextResponse.json(enquetes);
  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch enquetes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Validate related entities if provided
    if (json.enqueteurId) {
      const enqueteurExists = await prisma.enqueteur.findUnique({
        where: { id: json.enqueteurId },
      });
      if (!enqueteurExists) {
        return NextResponse.json(
          { error: 'Enqueteur not found' },
          { status: 404 }
        );
      }
    }

    if (json.secteurId) {
      const secteurExists = await prisma.secteur.findUnique({
        where: { id: json.secteurId },
      });
      if (!secteurExists) {
        return NextResponse.json(
          { error: 'Secteur not found' },
          { status: 404 }
        );
      }
    }

    const enquete = await prisma.enquete.create({
      data: json,
      include: {
        enqueteur: true,
        secteur: true,
      },
    });

    return NextResponse.json({
      message: 'Enquete created successfully',
      data: enquete,
    });
  } catch  {
    return NextResponse.json(
      { error: 'Failed to create enquete' },
      { status: 500 }
    );
  }
}


