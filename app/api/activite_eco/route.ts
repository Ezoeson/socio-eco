 // app/api/activite-economique/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activites = await prisma.activiteEconomique.findMany({
      include: {
        enquete: true,
        pecheur: true,
        collecteur: true,
      },
    });
    return NextResponse.json(activites);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch economic activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    // Validate enquete exists
    const enqueteExists = await prisma.enquete.findUnique({
      where: { id: json.enqueteId },
    });
    
    if (!enqueteExists) {
      return NextResponse.json(
        { error: "Enquete not found" },
        { status: 404 }
      );
    }

    // Validate pecheur exists if provided
    if (json.pecheur && json.pecheur.length > 0) {
      for (const pecheurId of json.pecheur) {
        const pecheurExists = await prisma.pecheur.findUnique({
          where: { id: pecheurId },
        });
        if (!pecheurExists) {
          return NextResponse.json(
            { error: `Pecheur with ID ${pecheurId} not found` },
            { status: 404 }
          );
        }
      }
    }

    // Validate collecteur exists if provided
    if (json.collecteur && json.collecteur.length > 0) {
      for (const collecteurId of json.collecteur) {
        const collecteurExists = await prisma.collecteur.findUnique({
          where: { id: collecteurId },
        });
        if (!collecteurExists) {
          return NextResponse.json(
            { error: `Collecteur with ID ${collecteurId} not found` },
            { status: 404 }
          );
        }
      }
    }

    const activite = await prisma.activiteEconomique.create({
      data: {
        ...json,
        pecheur: json.pecheur ? { connect: json.pecheur.map((id: string) => ({ id })) } : undefined,
        collecteur: json.collecteur ? { connect: json.collecteur.map((id: string) => ({ id })) } : undefined,
      },
      include: {
        enquete: true,
        pecheur: true,
        collecteur: true,
      },
    });

    return NextResponse.json({
      message: "Economic activity created successfully",
      data: activite,
    });
  } catch  {
    return NextResponse.json(
      { error: "Failed to create economic activity" },
      { status: 500 }
    );
  }
}